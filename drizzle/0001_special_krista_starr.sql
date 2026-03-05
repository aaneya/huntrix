CREATE TABLE `access_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recordId` int NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(50) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `access_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blockchain_hashes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recordId` int NOT NULL,
	`hash` varchar(255) NOT NULL,
	`blockNumber` int NOT NULL,
	`transactionHash` varchar(255),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`verified` boolean NOT NULL DEFAULT false,
	CONSTRAINT `blockchain_hashes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medical_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`doctorId` int,
	`recordType` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` longtext,
	`fileUrl` varchar(500),
	`fileKey` varchar(500),
	`blockchainHash` varchar(255),
	`blockchainBlock` int,
	`isVerified` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `medical_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `permissions_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role` enum('user','admin','patient','doctor','hospital','insurance') NOT NULL,
	`permissionId` int NOT NULL,
	CONSTRAINT `role_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','patient','doctor','hospital','insurance') NOT NULL DEFAULT 'user';