const { MeiliSearch } = require("meilisearch");

const client = new MeiliSearch({
  host: "http://localhost:7700",
  apiKey: "xc_igko_BIxFg2ryD_ORfbQXaMRStWWdUmAr2fWwXrs", // No API key has been set
});

INDEX_NAME = "customers";

(async () => {
  // console.log(`Updating Searchable Attributes for "${INDEX_NAME}"`);
  // await client.index(INDEX_NAME).updateSearchableAttributes(["last_name", "first_name", "email", "phone_day", "birthdate"]);
  const res = await client.index(INDEX_NAME).search('Bern', {
    limit: 5
  })
  console.log(res);


})();



// (async () => {
//   const res = await client.create_index('customers', {'primaryKey': 'id'});
//   console.log(res);
// });

// const INDEX_NAME = "customers";

// const index = client.index(INDEX_NAME);

// const data = require("./data.json");

// (async () => {
//   console.log(`Adding Filterable and Sortable Attributes to "${INDEX_NAME}"`);
//   await index.updateFilterableAttributes([
//     "brand",
//     "category",
//     "tag",
//     "rating",
//     "reviews_count",
//     "price",
//   ]);
//   await index.updateSortableAttributes(["reviews_count", "rating", "price"]);

//   console.log(`Adding Documents to "${INDEX_NAME}"`);
//   await index.updateDocuments(data);
//     console.log('Documents Added');
// })();
