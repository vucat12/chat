CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`name` text,
	`avatar` text,
	`username` text NOT NULL,
	`provider` text NOT NULL,
	`providerId` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_provider_providerId_unique` ON `users` (`provider`,`providerId`);