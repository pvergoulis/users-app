const User = require('../models/user.model')

exports.findAll = async(req,res)=>{
  console.log('Find all users product')

  try {
    const result = await User.find({},{username:1,products:1,_id:0})
    res.status(200).json({status:true, data: result})
  } catch (error) {
    console.log("Problem in finding all user's product", error)
    res.status(400).json({status: false, data: error})
  }
}

exports.findOne = async(req,res)=>{
  console.log('Find products for a specific user')
  const username = req.params.username

  try {
    const result = await User.findOne({username:username}, {username:1, products:1, _id:0})
    res.status(200).json({status:true, data: result})
  } catch (error) {
    console.log("Problem in finding user's product", error)
    res.status(400).json({status: false, data: error})
  }
}

exports.create = async(req,res)=>{
  console.log("Insert products to user")
  const username = req.body.username
  const products = req.body.products

  try {
    const result = await User.updateOne(
      {username : username},
      {
        $push: {
          products: products
        }
      }
    )
    res.status(200).json({status:true, data:result})
  } catch (error) {
    console.log('Error', error)
    res.status(400).json({status: false , data : error})
  }

}



exports.update = async (req, res)=>{
  const username = req.body.username
  const product_id = req.body.product._id
  const product_quantity = req.body.product.quantity

  console.log('Update product for username : ', username)

  try {
    const result = await User.updateOne(
     {username : username, "products._id": product_id},
     {
      $set:{
        "products.$.quantity": product_quantity
      }
     }
    )
    res.status(200).json({status:true, data: result})
  } catch (error) {
    console.log('Error in updated the product of the user ', error)
    res.status(400).json({status:false, data: error})
  }

}


exports.delete = async(req,res)=>{
    const username = req.params.username
    const product_id = req.params._id

    console.log('Delete product from user ', username)

    try {
      const result = await User.updateOne(
        {username: username},
        {
          $pull: {
            products:{_id: product_id}
          }
        }
      )
      res.status(200).json({status:true, data: result})
    } catch (error) {
      console.log('Error in delete the product of the user ', error)
      res.status(400).json({status:false, data: error})
    }
}


exports.stats1 = async(req,res)=>{
  console.log('For each users return total amount')

  try {
    const result = await User.aggregate([
        {
            $unwind: "$products"
        },
        {
            $project: {
                _id:1,
                 username:1,
                 products:1
            }
        },
        {
            $group: {
                _id: {
                    username: "$username",
                    product:"$products.product"
                },
                totalAmount: {
                    $sum: {
                        $multiply: ["$products.cost", "$products.quantity"]
                    }
                },
                count: {$sum: 1}
            }
        },
        {
            $sort: {"_id.username":1, "_id.product":1 }
        }
    ])
    res.status(200).json({status: true, data: result})
} catch (err) {
    console.log('Problem in stats1 ',err)
    res.status(200).json({status: false, data: err})
}
}


