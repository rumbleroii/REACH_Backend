const express = require('express');
const app = express();
const cors = require('cors');
const uniqid = require('uniqid');
const axios = require('axios');
const morgan = require('morgan');

// Filesystem
const fs = require('fs');
const PORT = 4000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// JSON.IO
const SECRET_KEY="$2b$10$n172Tc8qjDF5mztsfXFOS.5EEg32uuaxwoLo19KNYkbA1v1VNmOZ6";
const binID = "64c2a26db89b1e2299c6ac55"
const binUrl = `https://api.jsonbin.io/v3/b/${binID}`

const axiosInstance = axios.create({
  headers: {
    'X-Master-Key': SECRET_KEY,
    'Content-Type': 'application/json'
  }
});

// GET ALL
app.get('/all', async (req, res) => {    
  try {
    const dataArray = await axiosInstance.get(`${binUrl}`);  
    return res.status(200).json({
      data: dataArray.data.record
    })
  } catch (error) {
    console.error('Error parsing JSON data:', error);
    return res.status(500).json({
      message: "error"
    })
  }
})

// GET ID
app.get('/:id', async (req, res) => {    
  try {
    const response = await axiosInstance.get(`${binUrl}`);
    const dataArray = response.data.record;   
    const newData = dataArray.filter((item) => item.id == req.params.id);
 
    return res.status(200).json({
      data: newData
    })
  } catch (error) {
    console.error('Error parsing JSON data:', error);
    return res.status(500).json({
      message: "error"
    })
  }
})

// PUT
app.post('/create', async (req, res) => {    
  try {
    const response = await axiosInstance.get(`${binUrl}`);
    const dataArray = response.data.record  
    const newData = req.body

          // checkpoint
          let count = 0;
          for(let i=0;i<newData.checkpoint.length;i++) {
            if(newData.checkpoint[i].status === true) {
              count += 1;
            }
          }
          
          newData.progress = Math.floor((count / newData.checkpoint.length)* 100);
          if(newData.progress === 100) newData.status = "Information";

          if(newData.id) {
            for(let i=0;i<dataArray.length;i++) {
              if(dataArray[i].id == newData.id) {
                dataArray[i] = newData;
              }
            }
          } else {
            newData.id = uniqid();
            dataArray.push(newData);
            console.log(newData);
          }
          console.log(dataArray);
    const result = await axiosInstance.put(`${binUrl}`, dataArray);
    return res.status(200).json({
      message: "Updated"
    })
  } catch (error) {
    console.error('Error parsing JSON data:', error);
    return res.status(500).json({
      message: "error"
    })
  }
})

// DELETE
app.get('/delete/:id', async (req, res) => {    
  try {
    const response = await axiosInstance.get(`${binUrl}`);
    const dataArray = response.data.record;  
    const newData = dataArray.filter((item) => item.id != req.params.id);

    // checkpoint
    const result = await axiosInstance.put(`${binUrl}`, newData);
    return res.status(200).json({
      message: "Updated"
    })
  } catch (error) {
    console.error('Error parsing JSON data:', error);
    return res.status(500).json({
      message: "error"
    })
  }
})

app.listen(PORT, () => {
    console.log(`Server Running in PORT: ${PORT}`);
})