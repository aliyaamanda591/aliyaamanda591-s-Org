CREATE TABLE `password_reset_otps` (
	`email_hash` text PRIMARY KEY NOT NULL,
	`challenge_hash` text NOT NULL,
	`otp_hash` text NOT NULL,
	`user_id` text,
	`credential_version` integer NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`requested_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`ready` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `accounts`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `password_reset_otps_challenge_hash_unique` ON `password_reset_otps` (`challenge_hash`);