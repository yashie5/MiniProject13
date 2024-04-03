import {supabase} from '@config/supabase';
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from '@supabase/supabase-js'
// FETCHING TWEETS AND THEIR RESPECTIVE STATS
const fetchTweets = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('getTweets', {
        //this is part of the body of the http request that is passed into the function, I put it here
        // for post requests of making tweets and so forth
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (error) {
        throw error;
      }
      return data;

    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

   export {fetchTweets};

  const addTweet = async (tweetData: any) => {
  try {/*
    console.log(JSON.stringify(tweetData));
    const { data, error } = await supabase.functions.invoke('addTweet', {
      body: JSON.stringify(tweetData)
    });
    if (error) {
      throw error;
    }
    return data;*/
    //instantiate a variable for a file and pass it to upload
    const { data: uploadedImage, error: imageError } = await supabase.storage
      .from('media')
      .upload(`tweet_images/${tweetData.Img_filename}`, tweetData.Img_file, { upsert: false,
        contentType: 'image/jpg', // Set the content type of the image
      });

    if (imageError) {
      console.log(imageError);
      throw imageError;
    }
    
    //console.log("uploaded in media");

    const tweet = {
      User_Id:tweetData.User_Id,
      Content:tweetData.Content,
      Img_Url: uploadedImage.path
    };
    // Insert tweet data into the database
    const { data: insertedTweet, error: tweetError } = await supabase
      .from('Tweets')
      .insert([tweet])
      .select();

    if (tweetError) {
      throw tweetError;
    }
    return insertedTweet;
  } catch (error) {
    if (error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json()
      console.log('Function returned an error', errorMessage)
    } else if (error instanceof FunctionsRelayError) {
      console.log('Relay error:', error.message)
    } else if (error instanceof FunctionsFetchError) {
      console.log('Fetch error:', error.message)
    }
    throw error; // Re-throw the error to handle it in the calling code if needed
  }
};

export { addTweet };