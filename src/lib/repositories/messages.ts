import { supabase } from '@/lib/db/client';
import type { Database } from '@/lib/types/database';

type Message = Database['public']['Tables']['messages']['Row'];
type NewMessage = Database['public']['Tables']['messages']['Insert'];
type UpdateMessage = Database['public']['Tables']['messages']['Update'];

export interface MessageWithProfiles extends Message {
  sender?: Database['public']['Tables']['profiles']['Row'];
  recipient?: Database['public']['Tables']['profiles']['Row'];
  listing?: Database['public']['Tables']['listings']['Row'];
}

export interface Conversation {
  participant: Database['public']['Tables']['profiles']['Row'];
  last_message: MessageWithProfiles;
  unread_count: number;
  listing?: Database['public']['Tables']['listings']['Row'];
}

export class MessagesRepository {
  async getConversations(userId: string): Promise<Conversation[]> {
    // Get all conversations for user (grouped by the other participant)
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id(*),
        recipient:profiles!recipient_id(*),
        listing:listings(*)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

    if (!messages) return [];

    // Group messages by conversation partner
    const conversationMap = new Map<string, {
      participant: Database['public']['Tables']['profiles']['Row'];
      messages: MessageWithProfiles[];
      listing?: Database['public']['Tables']['listings']['Row'];
    }>();

    messages.forEach(message => {
      const otherParticipantId = message.sender_id === userId ? message.recipient_id : message.sender_id;
      const otherParticipant = message.sender_id === userId ? message.recipient : message.sender;
      
      if (!otherParticipant) return;

      const key = `${otherParticipantId}-${message.listing_id || 'general'}`;
      
      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          participant: otherParticipant,
          messages: [],
          listing: message.listing || undefined
        });
      }
      
      conversationMap.get(key)!.messages.push(message);
    });

    // Convert to conversations array
    const conversations: Conversation[] = [];
    
    conversationMap.forEach(({ participant, messages, listing }) => {
      const lastMessage = messages[0]; // Already sorted by created_at desc
      const unreadCount = messages.filter(m => 
        m.recipient_id === userId && !m.read_at
      ).length;

      conversations.push({
        participant,
        last_message: lastMessage,
        unread_count: unreadCount,
        listing
      });
    });

    // Sort by last message date
    conversations.sort((a, b) => 
      new Date(b.last_message.created_at || 0).getTime() - 
      new Date(a.last_message.created_at || 0).getTime()
    );

    return conversations;
  }

  async getConversationMessages(
    userId: string, 
    otherUserId: string, 
    listingId?: string
  ): Promise<MessageWithProfiles[]> {
    let query = supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id(*),
        recipient:profiles!recipient_id(*)
      `)
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`);

    if (listingId) {
      query = query.eq('listing_id', listingId);
    } else {
      query = query.is('listing_id', null);
    }

    query = query.order('created_at', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch conversation messages: ${error.message}`);
    }

    return data || [];
  }

  async sendMessage(message: NewMessage): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }

    return data;
  }

  async markAsRead(messageIds: number[]): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .in('id', messageIds);

    if (error) {
      throw new Error(`Failed to mark messages as read: ${error.message}`);
    }
  }

  async markConversationAsRead(userId: string, otherUserId: string, listingId?: string): Promise<void> {
    let query = supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('recipient_id', userId)
      .eq('sender_id', otherUserId)
      .is('read_at', null);

    if (listingId) {
      query = query.eq('listing_id', listingId);
    } else {
      query = query.is('listing_id', null);
    }

    const { error } = await query;

    if (error) {
      throw new Error(`Failed to mark conversation as read: ${error.message}`);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .is('read_at', null);

    if (error) {
      throw new Error(`Failed to get unread count: ${error.message}`);
    }

    return count || 0;
  }

  async deleteMessage(messageId: number, userId: string): Promise<void> {
    // Only allow deleting own messages
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)
      .eq('sender_id', userId);

    if (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }
}
