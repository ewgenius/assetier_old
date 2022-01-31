-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "paddleSubscriptionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionPlan" ALTER COLUMN "paddleSubscriptionPlanId" DROP NOT NULL;
