const mongoose = require("mongoose");

async function restructureRecipes() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/StockRecipes");

    const flexibleSchema = new mongoose.Schema({}, { strict: false });
    const RecipeModel = mongoose.model("Recipe", flexibleSchema, "recis");

    const containerDoc = await RecipeModel.findOne().lean();
if (!containerDoc) {
      console.log("No recipe data found in the collection.");
      return;
    }

    const recipeKeys = Object.keys(containerDoc).filter(
      key => !["_id", "__v"].includes(key)
    );
   const individualRecipes = recipeKeys.map(key => containerDoc[key]);

    if (individualRecipes.length === 0) {
      console.log("No individual recipes found to insert.");
      return;
    }
// Clear the collection to prepare for individual recipe documents
    await RecipeModel.deleteMany({});
// Insert each recipe as a separate document
    await RecipeModel.insertMany(individualRecipes);
  console.log(`Successfully inserted ${individualRecipes.length} individual recipe documents.`);

  } catch (err) {
    console.error("Error during restructuring recipes:", err);
  } finally {
    await mongoose.connection.close();
  }
}

restructureRecipes();