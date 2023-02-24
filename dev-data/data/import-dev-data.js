const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel.js');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    userFindAndModify: false
  })
  .then(() => {
    console.log('DB Connection Successful');
  });

  //READ JSON File
  const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));

  //IMPORT DATA INTO DB
  const importData=async()=>{
    try{
      await Tour.create(tours)
      console.log('Data successfully loaded');
    }catch(err){
    console.log(err);
    }
    
  process.exit();
  }

  
  //DELETE DATA FROM DB
  const deleteData=async()=>{
    try{
      await Tour.deleteMany();
      console.log('Data successfully deleted');
    }catch(err){
    console.log(err);
    }
    
  process.exit();
  }
  

  if(process.argv[2]==='--import'){
    importData();
  }
  else if(process.argv[2]==='--delete'){
    deleteData();
  }
  
  console.log(process.argv);