import {useContext} from 'react';
import {useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {doFetch} from '../utils/http';
import {apiUrl, applicationTag} from '../utils/Variables';

const useMedia = (update, myFilesOnly = false) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {user} = useContext(MainContext);
  // TODO: loadMedia() show only the files which have the identifier tag of your app
  const loadMedia = async () => {
    try {
      let json = await useTag().getFilesByTag(applicationTag);
      // const json = await response.json();
      if (myFilesOnly) {
        json = json.filter((file) => file.user_id === user.user_id);
      }
      json.reverse();
      const allMediaData = json.map(async (mediaItem) => {
        return await doFetch(apiUrl + 'media/' + mediaItem.file_id);
        // return await response.json();
      });
      setMediaArray(await Promise.all(allMediaData));
    } catch (error) {
      console.log('Media fetch failed', error);
      // TODO: Notify user
    }
  };
  useEffect(() => {
    loadMedia();
  }, [update]);

  const postMedia = async (token, data) => {
    const options = {
      method: 'POST',
      headers: {'x-access-token': token},
      body: data,
    };
    try {
      return await doFetch(apiUrl + 'media', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const putMedia = async (token, data, fileId) => {
    const options = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(data),
    };
    try {
      return await doFetch(apiUrl + 'media/' + fileId, options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const deleteMedia = async (token, fileId) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      return await doFetch(apiUrl + 'media/' + fileId, options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {mediaArray, postMedia, putMedia, deleteMedia};
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    // user credentials format: {username: 'someUsername', password: 'somePassword'}
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    };
    try {
      return await doFetch(apiUrl + 'login', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  const checkUsername = async (username) => {
    try {
      const result = await doFetch(apiUrl + 'users/username/' + username);
      return result.available;
    } catch (error) {}
  };

  const getUserByToken = async (token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const userData = await doFetch(apiUrl + 'users/user', options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const postUser = async (userData) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };
    try {
      return await doFetch(apiUrl + 'users', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getUserById = () => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
  };

  return {checkUsername, getUserByToken, postUser, getUserById};
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    return await doFetch(apiUrl + 'tags/' + tag);
  };

  const postTag = async (token, tag) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tag),
    };
    try {
      return await doFetch(apiUrl + 'tags', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {getFilesByTag, postTag};
};

export {useLogin, useMedia, useUser, useTag};
