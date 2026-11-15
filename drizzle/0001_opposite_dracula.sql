ALTER TABLE `accounts` ADD `profile_display_name` text;--> statement-breakpoint
ALTER TABLE `accounts` ADD `last_seen_at` text;--> statement-breakpoint
ALTER TABLE `accounts` ADD `support_status` text DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE `accounts` ADD `support_note` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `accounts` ADD `support_updated_at` text;