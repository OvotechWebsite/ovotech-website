import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Website privacy notice | OvoTech',
  description: 'How website enquiries and help messages are handled by Ovotech.',
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return <div className="privacy-page">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header><a href="/" aria-label="OvoTech home"><img src="/images/logo.svg" alt="OvoTech" width="180" /></a><a href="/demo">Contact the team</a></header>
    <main id="main-content" tabIndex={-1}>
      <p>Last updated: 7 October 2026</p>
      <h1>Website privacy notice</h1>
      <p>This notice covers enquiries sent through the Ovotech website. It does not describe the processing of clinical records within the Ovotech product, which is covered by separate deployment agreements.</p>
      <h2>Who to contact</h2>
      <p>Contact the Ovotech team at <a href="mailto:support@ovotech.co.uk">support@ovotech.co.uk</a> or 223-225 Stockport Road, Ashton-Under-Lyne, OL7 0NT.</p>
      <p>OVO TECH (NW) LTD is responsible for the personal information collected through this website.</p>
      <h2>Information you provide</h2>
      <p>Our forms ask for your name, work email, organisation and enquiry. Optional fields include your role, telephone number, organisation type, clinical system, practice size and areas of interest. Please do not submit patient information.</p>
      <h2>Why it is used</h2>
      <p>The team uses your enquiry to respond, arrange a demonstration or discuss assurance information. Required fields are needed to handle your request. You can also contact us directly by email.</p>
      <p>Our lawful basis is legitimate interests: responding to enquiries about our services, arranging requested demonstrations and providing information you ask for. You have the right to object to this processing by contacting us.</p>
      <h2>Where enquiries go</h2>
      <p>Form and help messages are saved to the website enquiry database for the team to review. The website uses Vercel hosting and a Neon database integration. A success message means the request was saved; it is not a personal reply.</p>
      <p>Website enquiry data is hosted in the United Kingdom. For information about our service providers and any processing or transfers outside the UK, contact <a href="mailto:support@ovotech.co.uk">support@ovotech.co.uk</a>.</p>
      <h2>How long information is kept</h2>
      <p>Our policy is to keep website enquiry details only until the query has been actioned, then delete them. Please contact us if you want to ask about the status or deletion of an enquiry.</p>
      <h2>Browser storage</h2>
      <p>The help panel stores conversation details in local browser storage until you clear that storage. A local preference remembers whether the help panel has been opened. Administrator sign-in uses a sign-in cookie. These storage mechanisms support the website’s functionality.</p>
      <h2>Your choices and rights</h2>
      <p>You may contact us about access to your information, corrections, deletion, restrictions or an objection to processing. Which rights apply depends on the processing and lawful basis. Where consent is used, you can withdraw it. You can raise a concern with the <a href="https://ico.org.uk/make-a-complaint/">Information Commissioner’s Office</a>.</p>
      <p><strong>Your right to object:</strong> contact support@ovotech.co.uk if you object to use of your details, including for direct marketing.</p>
      <h2>Automated decisions</h2>
      <p>The enquiry form records your message. The help panel provides preset information and automatic acknowledgements. These are not clinical advice or a live response from a team member.</p>
      <a href="/">Return to Ovotech</a>
    </main>
  </div>;
}
