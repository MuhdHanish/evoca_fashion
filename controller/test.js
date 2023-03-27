// let user = req.session.user
//         let cartCount = 0
//         if (user) {
//             let userId = user._id
//              cartCount = await CartCount(userId)
//         }
//         let proCount=await productCollection.countDocuments()
//         let limit=8
//         let skip=-0

//         let page=req.session.pagination
//         if(page) skip=(page-1)*limit;
       
        
        
        
//         let sort= req.session.sort
//         let filter=req.session.filter
            
//         let products=await productCollection.find({status:true}).limit(limit).skip(skip).toArray()
//         if(sort && filter){ 
//             if(sort=='low' && filter?.selection=='category'){
//                 let option=filter.option
//                 products=await productCollection.find({category:option,status:true}).limit(limit).skip(skip).sort({offerPrice:1}).toArray()
//                 proCount=await productCollection.countDocuments({category:option,status:true})
//             }else if(sort=='high' && filter?.selection=='category'){
//                 let option=filter.option
//                 products=await productCollection.find({category:option,status:true}).limit(limit).skip(skip).sort({offerPrice:-1}).toArray()
//                 proCount=await productCollection.countDocuments({category:option})
//             }else if(sort=='low' && filter?.selection=='brand'){
//                 let option=filter.option
//                 products=await productCollection.find({brand:option,status:true}).limit(limit).skip(skip).sort({offerPrice:1}).toArray()
//                 proCount=await productCollection.countDocuments({brand:option})
//             }else if(sort=='high' && filter?.selection=='brand'){
//                 let option=filter.option
//                 products=await productCollection.find({brand:option,status:true}).limit(limit).skip(skip).sort({offerPrice:-1}).toArray()
//                 proCount=await productCollection.countDocuments({brand:option})
//             }else if(sort=='low' && filter?.selection=='price'){
//                 let option=filter.option
//                 if(option=='1000'){
//                     products=await productCollection.find({offerPrice:{$lt:1000},status:true}).limit(limit).skip(skip).toArray()
//                     proCount=await productCollection.countDocuments({offerPrice:{$lt:1000}})
//                 }else if(option=='1000-2000'){
//                     products=await productCollection.find({$and:[{offerPrice:{$gt:1000}},{offerPrice:{$lt:2000}}],status:true}).limit(limit).skip(skip).sort({offerPrice:1}).toArray()
//                     proCount=await productCollection.countDocuments({$and:[{offerPrice:{$gt:1000}},{offerPrice:{$lt:2000}}]})
                    
//                 }else if(option=='2000-3000'){
//                     products=await productCollection.find({$and:[{offerPrice:{$gt:2000}},{offerPrice:{$lt:3000}}],status:true}).limit(limit).skip(skip).sort({offerPrice:1}).toArray()
//                     proCount=await productCollection.countDocuments({$and:[{offerPrice:{$gt:2000}},{offerPrice:{$lt:3000}}]})
//                 }else if(option=='3000-4000'){
//                     products=await productCollection.find({$and:[{offerPrice:{$gt:3000}},{offerPrice:{$lt:4000}}],status:true}).limit(limit).skip(skip).sort({offerPrice:1}).toArray()
//                     proCount=await productCollection.countDocuments({$and:[{offerPrice:{$gt:3000}},{offerPrice:{$lt:4000}}]})
//                 }else if(option=='4000-5000'){
//                     products=await productCollection.find({$and:[{offerPrice:{$gt:4000}},{offerPrice:{$lt:5000}}],status:true}).limit(limit).skip(skip).sort({offerPrice:1}).toArray()
//                     proCount=await productCollection.countDocuments({$and:[{offerPrice:{$gt:4000}},{offerPrice:{$lt:5000}}]})
//                 }else if(option=='5000'){
//                     products=await productCollection.find({offerPrice:{$gt:5000},status:true}).sort({offerPrice:1}).limit(limit).skip(skip).toArray()
//                     proCount=await productCollection.countDocuments({offerPrice:{$gt:5000}})
//                 }
//             }else if(sort=='high' && filter?.selection=='price'){
//                 let option=filter.option
//                 if(option=='1000'){
//                     products=await productCollection.find({offerPrice:{$lt:1000},status:true}).limit(limit).skip(skip).toArray()
//                     proCount=await productCollection.countDocuments({offerPrice:{$lt:1000}})
//                 }else if(option=='1000-2000'){
//                     products=await productCollection.find({$and:[{offerPrice:{$gt:1000}},{offerPrice:{$lt:2000}}],status:true}).limit(limit).skip(skip).sort({offerPrice:-1}).toArray()
//                     proCount=await productCollection.countDocuments({$and:[{offerPrice:{$gt:1000}},{offerPrice:{$lt:2000}}]})
//                 }else if(option=='2000-3000'){
//                     products=await productCollection.find({$and:[{offerPrice:{$gt:2000}},{offerPrice:{$lt:3000}}],status:true}).limit(limit).skip(skip).sort({offerPrice:-1}).toArray()
//                     proCount=await productCollection.countDocuments({$and:[{offerPrice:{$gt:2000}},{offerPrice:{$lt:3000}}]})
//                 }else if(option=='3000-4000'){
//                     products=await productCollection.find({$and:[{offerPrice:{$gt:3000}},{offerPrice:{$lt:4000}}],status:true}).limit(limit).skip(skip).sort({offerPrice:-1}).toArray()
//                     proCount=await productCollection.countDocuments({$and:[{offerPrice:{$gt:3000}},{offerPrice:{$lt:4000}}]})
//                 }else if(option=='4000-5000'){
//                     products=await productCollection.find({$and:[{offerPrice:{$gt:4000}},{offerPrice:{$lt:5000}}],status:true}).limit(limit).skip(skip).sort({offerPrice:-1}).toArray()
//                     proCount=await productCollection.countDocuments({$and:[{offerPrice:{$gt:4000}},{offerPrice:{$lt:5000}}]})
//                 }else if(option=='5000'){
//                     products=await productCollection.find({offerPrice:{$gt:5000},status:true}).limit(limit).skip(skip).sort({offerPrice:-1}).toArray()
//                     proCount=await productCollection.countDocuments({offerPrice:{$gt:5000}})
//                 }
//             }

//         }
//         else if(sort=='low'){
//             console.log("/shop",sort);
//             products=await productCollection.find({status:true}).limit(limit).skip(skip).sort({offerPrice:1}).toArray()
            

//         }else if(sort=='high'){
//             products=await productCollection.find({status:true}).limit(limit).skip(skip).sort({offerPrice:-1}).toArray()
//         }else if(filter?.selection=='category'){
//             let option=filter.option
//             products=await productCollection.find({category:option,status:true}).limit(limit).skip(skip).toArray()
//             proCount=await productCollection.countDocuments({category:option})
            
//         }else if(filter?.selection=='brand'){
//             let option=filter.option
//             products=await productCollection.find({brand:option,status:true}).limit(limit).skip(skip).toArray()
//             proCount=await productCollection.countDocuments({brand:option})
//         }else if(filter?.selection=='price'){
//             let option=filter.option
//             console.log(option);
//             if(option=='1000'){
//                 products=await productCollection.find({offerPrice:{$lt:1000},status:true}).limit(limit).skip(skip).toArray()
//                 proCount=await productCollection.countDocuments({offerPrice:{$lt:1000}})
//             }else if(option=='1000-2000'){
//                 products=await productCollection.find({$and:[{offerPrice:{$gt:1000}},{offerPrice:{$lt:2000}}],status:true}).limit(limit).skip(skip).toArray()
//                 proCount=await productCollection.countDocuments({$and:[{offerPrice:{$gt:1000}},{offerPrice:{$lt:2000}}]})
//             }else if(option=='2000-3000'){
//                 products=await productCollection.find({$and:[{offerPrice:{$gt:2000}},{offerPrice:{$lt:3000}}],status:true}).limit(limit).skip(skip).toArray()
//                 proCount=await productCollection.countDocuments({$and:[{offerPrice:{$gt:2000}},{offerPrice:{$lt:3000}}]})
//             }else if(option=='3000-4000'){
//                 products=await productCollection.find({$and:[{offerPrice:{$gt:3000}},{offerPrice:{$lt:4000}}],status:true}).limit(limit).skip(skip).toArray()
//                 proCount=await productCollection.countDocuments({$and:[{offerPrice:{$gt:3000}},{offerPrice:{$lt:4000}}]})
//             }else if(option=='4000-5000'){
//                 products=await productCollection.find({$and:[{offerPrice:{$gt:4000}},{offerPrice:{$lt:5000}}],status:true}).limit(limit).skip(skip).toArray()
//                 proCount=await productCollection.countDocuments({$and:[{offerPrice:{$gt:4000}},{offerPrice:{$lt:5000}}]})
//             }else if(option=='5000'){
//                 products=await productCollection.find({offerPrice:{$gt:5000},status:true}).limit(limit).skip(skip).toArray()
//                 proCount=await productCollection.countDocuments({offerPrice:{$gt:5000}})
//             } 