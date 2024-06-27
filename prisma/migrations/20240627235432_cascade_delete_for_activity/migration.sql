-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_postId_fkey";

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
