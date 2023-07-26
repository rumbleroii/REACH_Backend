const express = require('express');
const app = express();
const cors = require('cors');
const uniqid = require('uniqid');

// Filesystem
const fs = require('fs');

const PORT = 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// Path
const PATH = "../REACH_Dashboard/src/components/data.json"

// CREATE
app.post('/create', (req, res) => {
    fs.readFile(PATH, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading the JSON file:', err);
          return;
        }
      
        try {
          const dataArray = JSON.parse(data);
          const newData = req.body;

          // Adding ID
          newData.id = uniqid();

          dataArray.push(newData);
      
          const updatedData = JSON.stringify(dataArray, null, 2);
      
          fs.writeFile(PATH, updatedData, (err) => {
            if (err) {
              console.error('Error writing to the JSON file:', err);
            } else {
              console.log('Data appended successfully.');
            }
          });
        } catch (error) {
          console.error('Error parsing JSON data:', error);
        }
    });
})


// DELETE
app.delete('/delete/:id', (req, res) => {
    fs.readFile(PATH, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading the JSON file:', err);
          return;
        }
      
        try {
            const dataArray = JSON.parse(data);
            const newData = dataArray.filter((item) => item.id != req.params.id);
            const updatedData = JSON.stringify(newData, null, 2);

            console.log(req.params.id);
        
            fs.writeFile(PATH, updatedData, (err) => {
                if (err) {
                console.error('Error writing to the JSON file:', err);
                } else {
                console.log('Data appended successfully.');
                }
            });

            return res.status(200).json({
            smessage: "Deleted!"
            })
        } catch (error) {
          console.error('Error parsing JSON data:', error);
        }
    });
})

// GET ALL Data
app.get('/all', (req, res) => {
  fs.readFile(PATH, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading the JSON file:', err);
        return;
      }
    
      try {
          const dataArray = JSON.parse(data);
          const updatedData = JSON.stringify(dataArray, null, 2);
          
          return res.status(200).json({
            data: dataArray
          })

      } catch (error) {
        console.error('Error parsing JSON data:', error);
      }
  });
})

// GET
app.get('/:id', (req, res) => {
  fs.readFile(PATH, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading the JSON file:', err);
        return;
      }
    
      try {
          const dataArray = JSON.parse(data);
          const newData = dataArray.filter((item) => item.id == req.params.id);
          const updatedData = JSON.stringify(newData, null, 2);
      
          return res.status(200).json({
            data: newData
          })

      } catch (error) {
        console.error('Error parsing JSON data:', error);
      }
  });
})




app.listen(PORT, () => {
    console.log(`Server Running in PORT: ${PORT}`);
})