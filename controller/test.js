showProducts : async(req,res)=>{
let user=req.session.user;
let cartCount = req.session.cartCount;
let filterId = req.session.filterId;
let filterMsg;
let filter = req.session.filter;
let sort = req.session.sort;
let sortId = req.session.sortId;
let categoryList = req.session.categoryList;
let categoryId = req.session.categoryId;
let products;
// if(categoryId == 'all'){
// console.log("set to null");
// products = await product.find().toArray();
// if(products.length==0){
// filterMsg="No results found";
// }
// }
console.log("bbb",sortId);
products = await product.find().toArray();
console.log("sort ",sort);
console.log("filter ",filter);
console.log("category ",categoryList);
let categories = await category.find().toArray();
console.log("cattt",categories);

if(sort && filter){
if(sortId == 'ascending' && filterId == 'less-than-100'){
products = await product.find({price:{$lt:100}}).sort({price:1}).toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}
}
else if(sortId == 'ascending' && filterId == 'btw-100-and-300'){
products = await product.find({price:{$gt:100,$lt:300}}).sort({price:1}).toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}
}
else if(sortId == 'ascending' && filterId == 'above-300'){
products = await product.find({price:{$gt:300}}).sort({price:1}).toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}
}
else if(sortId == 'ascending' && filterId == 'all'){
products = await product.find().sort({price:1}).toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}
}
// else if(sortId == 'ascending'){
// products = await product.find().sort({price:1}).toArray();
// if(products.length === 0){
// filterMsg = 'No results found!';
// }
// }

else if(sortId == 'descending' && filterId == 'less-than-100'){
products = await product.find({price:{$lt:100}}).sort({price:-1}).toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}
}
else if(sortId == 'descending' && filterId == 'btw-100-and-300'){
products = await product.find({price:{$gt:100,$lt:300}}).sort({price:-1}).toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}
}
else if(sortId == 'descending' && filterId == 'above-300'){
products = await product.find({price:{$gt:300}}).sort({price:-1}).toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}
}
else if(sortId == 'descending' && filterId == 'all'){
products = await product.find().sort({price:-1}).toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}
}
// else if(sortId == 'descending'){
// products = await product.find().sort({price:-1}).toArray();
// if(products.length === 0){
// filterMsg = 'No results found!';
// }
// }
// else if(sortId == 'ascending'){
// products = await product.find().sort({price:1}).toArray();
// if(products.length === 0){
// filterMsg = 'No results found!';
// }
// }

}
// ifff enddddddddddd
else if(sort && categoryList){
if(sortId == 'descending'){
products = await product.find({category : categoryId}).sort({price:-1}).toArray();
if(products.length==0){
filterMsg="No results found";
}
}
else if(sortId == 'ascending'){
products = await product.find({category : categoryId}).sort({price:1}).toArray();
if(products.length==0){
filterMsg="No results found";
}
}
}
else if(filter && categoryList){
if(filterId == 'less-than-100'){
products =await product.find({$and:[{price:{$lt:100}},{category:categoryId}]}).toArray();
if(products.length==0){
filterMsg="No results found";
}
}
else if(filterId == 'btw-100-and-300'){
products = await product.find({$and:[{price:{$gt:100,$lt:300}},{category:categoryId}]}).toArray();
if(products.length==0){
filterMsg="No results found";
}
}
else if(filterId == 'above-300'){
products = await product.find({$and:[{price:{$gt:300}},{category:categoryId}]}).toArray();
if(products.length==0){
filterMsg="No results found";
}
}

}
else if(sortId == 'descending'){
products = await product.find().sort({price:-1}).toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}
}
else if(sortId == 'ascending'){
products = await product.find().sort({price:1}).toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}
}

else if(filterId == 'less-than-100'){
products = await product.find({price:{$lt:100}}).toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}
}
else if(filterId == 'btw-100-and-300'){
products = await product.find({price:{$gt:100,$lt:300}}).toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}
}
else if(filterId == 'above-300'){
products = await product.find({price:{$gt:300}}).toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}
}
else if(filterId == 'all'){
products = await product.find().toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}
}
else if(categoryList){
// if(categoryId == 'all'){
// products = await product.find().toArray();
// if(products.length === 0){
// filterMsg = 'No results found!';
// }
// }

products = await product.find({category:categoryId}).toArray();
if(products.length === 0){
filterMsg = 'No results found!';
}


}
else{
products = await product.find().toArray();
}

console.log("jnn",products);
res.render('user/shop',{products,user,cartCount,filterMsg,categories,sortId});
}