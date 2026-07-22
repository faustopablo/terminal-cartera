CREATE TABLE `assets` (
	`id` text PRIMARY KEY NOT NULL,
	`symbol` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`quantity` real NOT NULL,
	`currency` text NOT NULL,
	`buy_price` real NOT NULL,
	`price` real NOT NULL,
	`previous_close` real NOT NULL,
	`status` text
);
