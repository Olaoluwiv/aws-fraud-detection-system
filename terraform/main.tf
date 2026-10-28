
output "vaultguard" {
  description = "The name of the VaultGuard instance"
  value       = var.vaultguard
}

output "environment" {
  description = "The environment in which the resources are deployed"
  value       = var.environment
}

output "aws_region" {
  description = "The AWS region in which the resources are deployed"
  value       = var.aws_region
}

output "s3_bucket_vaultguard_data" {
  description = "The name of the s3 bucket for vaultguard data"
  value       = var.bucket_name
}

resource "aws_s3_bucket" "vaultguard_data" {
  bucket = var.bucket_name

  tags = {
    Name        = "VaultGuard Data"
    Environment = var.environment
    Project     = var.vaultguard
  }
}

resource "aws_s3_bucket_versioning" "vaultguard_data_versioning" {
  bucket = aws_s3_bucket.vaultguard_data.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "vaultguard_data_public_access_block" {
  bucket                  = aws_s3_bucket.vaultguard_data.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "vaultguard_data_encryption" {
  bucket = aws_s3_bucket.vaultguard_data.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}