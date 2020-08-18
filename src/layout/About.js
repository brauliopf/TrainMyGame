import React from 'react';

export default () => {

  const img_about_1 = 'https://train-my-game.s3.us-east-2.amazonaws.com/app/content/about/01.png';
  const img_about_2 = 'https://train-my-game.s3.us-east-2.amazonaws.com/app/content/about/02.png';
  const img_about_3 = 'https://train-my-game.s3.us-east-2.amazonaws.com/app/content/about/03.png';

  return (
    <div id="row mb-5 about" style={{marginTop: '10px'}}>
      <h3 className="col-12">About Us</h3>
      <div className="col-12">
        <div>
          TrainMyGame was created to provide athletes access to the best coaches in their surrounding areas. Coaches that understand what it takes to play at either the college or professional levels, and have extensive backgrounds in their sport and position to help get you to where they've been. We created this platform out of a combination of the need for access to high quality coaches, on top of the want of high quality coaches to easily pass on what they've learned to the athletes of the future.

          Our group sessions allow coaches to work with more than one player at a time, and gives players the chance to work along side other up and coming athletes.

          If your favorite coach is unavailable, or you want to get a taste of a different coaching and playing style, check out some other coaches to diversify feedback and a coaches area of expertise you're exposed to.

          Our goal is to make this all as beneficial as possible for players, coaches, and parents. Our hope is to prove this is something beneficial for all involved, and we can expand our coaching and services to areas outside of Long Island, and eventually outside of just lacrosse too.

          Looking for some help outside of physical coaching? Our goal with our social media accounts is to provide value to help build success outside of just getting on a field with a coach. Our content features, habits, routines, tools and advice from TMG quality players, coaches, and mentors.

          Please feel free to shoot us an email at <b>trainmygame3@gmail.com</b> with any questions, comments, or concerns about what we are building, how we can do better, or provide more value in any way... we'd love to hear from you.

        </div>
      </div>
      {/*<div>*/}
      {/*  <div className="text-center mt-4">*/}
      {/*    <img src={img_about_1} className="rounded col col-sm-3" alt="..." />*/}
      {/*    <img src={img_about_2} className="rounded col col-sm-3 mt-3 mt-0" alt="..." />*/}
      {/*    <img src={img_about_3} className="rounded col col-sm-3 mt-3 mt-0" alt="..." />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};
