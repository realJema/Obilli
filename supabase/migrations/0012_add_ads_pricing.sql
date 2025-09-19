-- Insert pricing for the new 'ads' tier
INSERT INTO public.boost_pricing (tier, price_per_day) 
VALUES ('ads', 1500)
ON CONFLICT (tier) DO UPDATE SET price_per_day = 1500;