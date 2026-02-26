import "dotenv/config";
import connectDB from "./configs/db.js";
import Thumbnail from "./models/Thumbnail.js";

// Migration script to fix imageUrl -> image_url field naming
async function migrateImageUrlField() {
    try {
        await connectDB();
        console.log('🔄 Starting migration: imageUrl -> image_url');

        // Find all thumbnails where imageUrl exists
        const thumbnails = await Thumbnail.find({}).lean();
        console.log(`📊 Found ${thumbnails.length} total thumbnails`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const thumb of thumbnails) {
            const thumbAny = thumb as any;
            
            // If imageUrl exists but image_url is empty or missing
            if (thumbAny.imageUrl && (!thumbAny.image_url || thumbAny.image_url === '')) {
                await Thumbnail.updateOne(
                    { _id: thumb._id },
                    { 
                        $set: { image_url: thumbAny.imageUrl },
                        $unset: { imageUrl: "" }
                    }
                );
                console.log(`✅ Migrated: ${thumb._id} - ${thumbAny.imageUrl}`);
                migratedCount++;
            } else {
                skippedCount++;
            }
        }

        console.log(`\n✨ Migration complete!`);
        console.log(`   Migrated: ${migratedCount}`);
        console.log(`   Skipped: ${skippedCount}`);
        console.log(`   Total: ${thumbnails.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrateImageUrlField();
