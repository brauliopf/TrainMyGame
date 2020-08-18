import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Contexts'
import { Link } from 'react-router-dom';
import $ from 'jquery';
import AWS from 'aws-sdk'
import { s3Config } from '../util/s3';

AWS.config.update({ region: s3Config.region, accessKeyId: s3Config.accessKeyId, secretAccessKey: s3Config.secretAccessKey });
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

export default function ProfilePicUpload({ setApplicationPic = () => { return; } }) {

  const { state, } = useContext(Context);
  const user = state.auth && state.auth.isAuthenticated && state.auth.user
  const [picture, setPicture] = useState(`${s3Config.bucketURL}/avatar/default/01.png`);

  useEffect(() => {
    if (user && user.picture && user.picture.length > 0) setPicture(user.picture);
  }, [user])

  const uploadFile = (file) => { // upload file to s3
    const uploadParams = {
      ACL: "public-read",
      Bucket: s3Config.bucketName,
      Key: user ? `avatar/${user._id}` : `avatar/temporary/${Date.now()}`,
      Body: file
    };

    s3.upload(uploadParams, function (err, data) {
      if (err) {
        console.log("Error - picture upload: ", err);
      } else {
        const newUrl = `${s3Config.bucketURL}/${data.key}`;
        setPicture(newUrl)
        setApplicationPic(newUrl);
      }
    })
  }

  return (
    <div className="d-flex flex-column">
      <img
        className="img-thumbnail" src={picture} alt={"avatar"}
        style={{ maxHeight: "180px", maxWidth: "180px" }}
      />
      <Link className="mt-1" style={{ "fontSize": "14px" }} to="#" onClick={() => $("#imageUpload").click()}><i className="fas fa-file-upload"></i> Submit Profile Head Shot </Link>
      <input id="imageUpload" style={{ display: "none" }} type="file" onChange={e => uploadFile(e.target.files[0])} />
    </div>
  )
}
