-- CreateEnum
CREATE TYPE "public"."ExecutionStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "public"."Execution" (
    "id" TEXT NOT NULL,
    "workflow_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "status" "public"."ExecutionStatus" NOT NULL DEFAULT 'RUNNING',

    CONSTRAINT "Execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NodeExecution" (
    "id" TEXT NOT NULL,
    "execution_id" TEXT NOT NULL,
    "node_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "status" "public"."ExecutionStatus" NOT NULL,
    "output" JSONB,
    "error" JSONB,

    CONSTRAINT "NodeExecution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NodeExecution_execution_id_node_id_idx" ON "public"."NodeExecution"("execution_id", "node_id");

-- AddForeignKey
ALTER TABLE "public"."Execution" ADD CONSTRAINT "Execution_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "public"."Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NodeExecution" ADD CONSTRAINT "NodeExecution_execution_id_fkey" FOREIGN KEY ("execution_id") REFERENCES "public"."Execution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
