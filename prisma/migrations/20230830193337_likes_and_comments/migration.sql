-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "Comments" JSONB[],
ADD COLUMN     "Likes" JSONB[];
