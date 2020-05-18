import React from 'react';

export default () => {

  const img_about_1 = 'https://train-my-game.s3.us-east-2.amazonaws.com/app/content/about/01.png';
  const img_about_2 = 'https://train-my-game.s3.us-east-2.amazonaws.com/app/content/about/02.png';
  const img_about_3 = 'https://train-my-game.s3.us-east-2.amazonaws.com/app/content/about/03.png';

  return (
    <div id="row mb-5 about">
      <h3 className="col-12">About Us</h3>
      <div className="col-12">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
            <div className="mt-3"></div>
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
            <div className="mt-3"></div>
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
          </div>
      <div>
        <div className="text-center mt-4">
          <img src={img_about_1} className="rounded col col-sm-3" alt="..." />
          <img src={img_about_2} className="rounded col col-sm-3 mt-3 mt-0" alt="..." />
          <img src={img_about_3} className="rounded col col-sm-3 mt-3 mt-0" alt="..." />
        </div>
      </div>
    </div>
  );
};
