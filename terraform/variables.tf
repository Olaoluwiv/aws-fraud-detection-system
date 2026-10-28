
variable "vaultguard" {
  description = "The name of the VaultGuard instance"
  type        = string
  default     = "vaultguard"
}

variable "environment" {
  description = "The environment in which the resources are deployed"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region for VaultGuard"
  type        = string
  default     = "us-east-1"
}
variable "bucket_name" {
  description = "The name of the S3 bucket for VaultGuard data"
  type        = string
  default     = "vaultguard-data-027174261562-dev"
}
