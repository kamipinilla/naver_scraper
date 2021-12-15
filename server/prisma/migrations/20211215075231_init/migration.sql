-- CreateTable
CREATE TABLE "Word" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SentPair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "targetSent" TEXT NOT NULL,
    "sourceSent" TEXT NOT NULL,
    "origTargetSent" TEXT,
    "origSourceSent" TEXT,
    "wordId" INTEGER NOT NULL,
    CONSTRAINT "SentPair_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_name_key" ON "Word"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SentPair_targetSent_sourceSent_key" ON "SentPair"("targetSent", "sourceSent");
