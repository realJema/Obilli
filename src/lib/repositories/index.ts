// Repository classes for database operations
export { ListingsRepository } from './listings';
export { CategoriesRepository } from './categories';
export { ProfilesRepository } from './profiles';
export { MessagesRepository } from './messages';
export { ReviewsRepository } from './reviews';
export { BoostsRepository } from './boosts';
export { AdsRepository } from './ads';
export { locationsRepo } from './locations';

// Import classes for instances
import { ListingsRepository } from './listings';
import { CategoriesRepository } from './categories';
import { ProfilesRepository } from './profiles';
import { MessagesRepository } from './messages';
import { ReviewsRepository } from './reviews';
import { BoostsRepository } from './boosts';
import { AdsRepository } from './ads';

// Repository factory functions
export const createListingsRepo = () => new ListingsRepository();
export const createCategoriesRepo = () => new CategoriesRepository();
export const createProfilesRepo = () => new ProfilesRepository();
export const createMessagesRepo = () => new MessagesRepository();
export const createReviewsRepo = () => new ReviewsRepository();
export const createBoostsRepo = () => new BoostsRepository();
export const createAdsRepo = () => new AdsRepository();

// Default instances for convenience
export const listingsRepo = createListingsRepo();
export const categoriesRepo = createCategoriesRepo();
export const profilesRepo = createProfilesRepo();
export const messagesRepo = createMessagesRepo();
export const reviewsRepo = createReviewsRepo();
export const boostsRepo = createBoostsRepo();
export const adsRepo = createAdsRepo();

// Type exports
export type { ListingFilters, ListingSort } from './listings';
export type { CategoryWithChildren } from './categories';
export type { ProfileWithStats } from './profiles';
export type { MessageWithProfiles, Conversation } from './messages';
export type { ReviewWithProfiles, ReviewStats } from './reviews';
export type { Location, LocationOption } from './locations';