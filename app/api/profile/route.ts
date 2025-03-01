import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the update data from request body
    const updates = await request.json()

    // Validate required fields
    if (!updates.username || !updates.full_name) {
      return NextResponse.json(
        { error: 'Username and full name are required' },
        { status: 400 }
      )
    }

    // Check if username is already taken (excluding current user)
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', updates.username)
      .neq('id', user.id)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      )
    }

    // Update the profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        username: updates.username,
        full_name: updates.full_name,
        bio: updates.bio,
        location: updates.location,
        avatar_url: updates.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
} 
