import express from 'express';
import 'dotenv/config'

const server = express();
const port = 4000;

async function fetchJoke(){
  let url =  `https://api.api-ninjas.com/v1/dadjokes`; 
  try{
    let response = await fetch(url, {
      method: "GET",
      headers: { 
        'X-Api-Key': process.env.APININJAS_DADJOKES_ACCESS_KEY,
        "Content-Type": "application/json",
      },
    });
    let jsonResponse = await response.json();    
    let [{joke}] = jsonResponse;
    return {'randomJoke': joke};      
  }catch(error){
    throw new Error('Unable to genrate random joke, please try again after some time!');    
  }
  
} 
async function fetchImage(){
  try {
    let request =  `https://api.unsplash.com/photos/random/?client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
    let response = await fetch(request);
    let imgData = {};
    if(response){
      response = await response.json();
      imgData.url = response.urls.regular; 
      imgData.description = response.alt_description; 
      return {'randomImage': imgData};
    }else{
      throw new Error('Unable to fetch data from API, something went wrong!');
    }
  } catch (error) {    
    throw new Error('Unable to genrate random image, please try again after some time!');    
  }
}
server.get('/api/image-and-joke/random', async(req, res)=>{
  console.log();
  try {    
    let randomImage = await fetchImage();
    let randomJoke =  await fetchJoke();
    // console.log(randomJoke);
    res.json({...randomJoke, ...randomImage});
    
    
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }

  
});

server.listen(port, ()=>{
  console.log(`Express server is running at port ${port}`);
});

