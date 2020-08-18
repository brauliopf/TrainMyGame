import React from 'react'

let styles = {
  paragraph: {
    marginBottom: '10px',
  }
}

const FAQ = () => {

  return (
    <div id='about'>
      <div className="row my-4 mx-2">
        <div className="col-12 mb-5 py-4 border" id="about_us">
          <h3 className="">FAQ</h3>

          <div className="card-body">
            <h4><b>What value is added from booking with TrainMyGame?</b></h4>
            <p style={styles.paragraph}>
              -TrainMyGame provides all coaches with general liability insurance up to $1,000,000. This coverage applies to all sessions booked through TrainMyGame.
            </p>
            <p style={styles.paragraph}>
              -Clients agree to a liability waiver when they sign up for TrainMyGame. This provides you with an extra level of coverage in the event of an accident or injury during a TMG session.
            </p>
            <p style={styles.paragraph}>
              -Posting group sessions on TrainMyGame.com allows anybody in your surrounding area to see your upcoming sessions and availability, as well as promotes participants to tell their friends to join.
            </p>
            <p style={styles.paragraph}>
              -We do your marketing for you, but feel free to also post about your sessions and availability on the internet.
            </p>
            <p style={styles.paragraph}>
              -More features to help fill sessions and make things more efficient for everyone involved coming soon... reach out with feedback and we will take it into great consideration.
            </p>
          </div>

          <div className="card-body">
            <h4><b>What is TrainMyGame's cancellation policy?</b></h4>
            <p>
              -Participant are able to cancel or leave a session up to 24 hours before a training session is scheduled to take place.
            </p>
          </div>

          <div className="card-body">
            <h4><b>Can I feel comfortable paying through TrainMyGame?</b></h4>
            <p style={styles.paragraph}>
              -Our transactions are processed online to ensure safe, secure transfer of payment to your coach. We accept all major credit cards including Visa, MasterCard, American Express, and Discover. We also accept payment via PayPal and Apple Pay. We do not accept payments via cash or check.
            </p>
            <p style={styles.paragraph}>
              -We process all payments via Stripe, a payment provider that is completely encrypted, safe and secure. Stripe offers an SSL-encrypted, PCI-compliant system which is trusted by companies worldwide.
            </p>

          </div>

          <div className="card-body">
            <h4><b>Who's responsible for providing a field?</b></h4>
            <p style={styles.paragraph}>
              -Our coaches are responsible for finding a facility or location for their coaching sessions. However, communication is key, and client's suggesting a facility/field that is a convenient will help tremendously. Coaches are welcome to train at a location of the client's choosing.
            </p>
            <p style={styles.paragraph}>
              -We completely understand that securing a facility is one of the biggest obstacles to conducting a great coaching session. As a result, we're working hard to compile a list of recommended facilities and fields in the near future.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ;