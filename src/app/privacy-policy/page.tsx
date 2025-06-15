import React from "react";

function PrivacyPolicyPage() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Privacy Policy for CardSift (Beta)
        </h1>

        <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow-lg">
          <p className="text-muted-foreground mb-6 text-sm">
            <strong>Effective Date:</strong> June 15, 2025
          </p>

          <p className="text-muted-foreground mb-6">
            Thank you for participating in the CardSift Beta program! Your
            privacy is important to us. This Privacy Policy outlines how we
            collect, use, and protect your information during this beta testing
            phase. By using CardSift (Beta), you agree to the terms of this
            Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">
            1. Information We Collect
          </h2>
          <p className="text-muted-foreground mb-4">
            During the CardSift Beta, we may collect the following types of
            information:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
            <li>
              <strong>Account Information:</strong> When you register for
              CardSift, we collect your name, email address, and password.
            </li>
            <li>
              <strong>User Profile Information:</strong> To personalize your
              experience and check eligibility, we collect information such as
              your monthly income, employment type, location, preferred card
              usage, and credit card preferences.
            </li>
            <li>
              <strong>Usage Data:</strong> We collect data about how you use
              CardSift, including the credit cards you search for, compare, and
              view; your interactions with the AI chat feature; and the pages
              you visit.
            </li>
            <li>
              <strong>Device Information:</strong> We may collect information
              about the device you use to access CardSift, including your device
              type, operating system, and IP address.
            </li>
            <li>
              <strong>Scraped Data:</strong> If you provide a credit card URL
              for data extraction, we collect the data from bank websites.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">
            2. How We Use Your Information
          </h2>
          <p className="text-muted-foreground mb-4">
            We use your information for the following purposes:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
            <li>
              <strong>To Provide and Improve CardSift:</strong> We use your data
              to provide you with the CardSift service, personalize your
              experience, improve our AI algorithms, and develop new features.
            </li>
            <li>
              <strong>To Check Eligibility:</strong> We use your profile
              information to assess your eligibility for specific credit cards.
            </li>
            <li>
              <strong>To Communicate with You:</strong> We may use your email
              address to send you updates about CardSift, beta program
              announcements, and respond to your inquiries.
            </li>
            <li>
              <strong>For Research and Analysis:</strong> We may use anonymized
              and aggregated data for research and analysis purposes to improve
              CardSift and understand user behavior.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">
            3. Data Sharing and Disclosure
          </h2>
          <p className="text-muted-foreground mb-4">
            We may share your information in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
            <li>
              <strong>With Service Providers:</strong> We may share your
              information with third-party service providers who assist us with
              hosting, data analysis, email delivery, and other services. These
              providers are contractually obligated to protect your information.
            </li>
            <li>
              <strong>For Legal Compliance:</strong> We may disclose your
              information if required by law, such as to comply with a subpoena
              or court order.
            </li>
            <li>
              <strong>In Connection with a Business Transfer:</strong> If
              CardSift is involved in a merger, acquisition, or sale of all or a
              portion of its assets, your information may be transferred as part
              of that transaction.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">
            4. Data Security
          </h2>
          <p className="text-muted-foreground mb-4">
            We take reasonable measures to protect your information from
            unauthorized access, use, or disclosure. These measures include:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
            <li>
              <strong>Encryption:</strong> We use industry-standard encryption
              to protect your data during transmission.
            </li>
            <li>
              <strong>Secure Storage:</strong> We store your data on secure
              servers with limited access.
            </li>
            <li>
              <strong>Regular Security Audits:</strong> We conduct regular
              security audits to identify and address vulnerabilities.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">
            5. Data Retention
          </h2>
          <p className="text-muted-foreground mb-6">
            We will retain your information for as long as necessary to provide
            you with the CardSift Beta service, comply with our legal
            obligations, resolve disputes, and enforce our agreements.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">
            6. Your Rights
          </h2>
          <p className="text-muted-foreground mb-4">
            During the Beta program, your rights regarding your data may be
            limited. However, we are committed to transparency and will make
            reasonable efforts to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
            <li>
              <strong>Provide Access to Your Data:</strong> Upon request, we
              will provide you with a copy of the information we have about you.
            </li>
            <li>
              <strong>Correct Inaccurate Information:</strong> You can update
              your account and profile information at any time.
            </li>
            <li>
              <strong>Delete Your Account:</strong> You can request to delete
              your CardSift account, and we will remove your data from our
              systems (subject to legal requirements).
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">
            7. AI Chat Data Handling
          </h2>
          <p className="text-muted-foreground mb-6">
            All chats with AI are saved for training purposes. Chat data will
            only be seen by our team in aggregated form to train AI models to
            answer questions better and data is not shared to any third party
            and kept securely.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">
            8. Scraping Data Handling
          </h2>
          <p className="text-muted-foreground mb-6">
            All scraping done is for generating credit card information and will
            use reasonable measures to maintain all credit cards. All of them
            will be shown to user.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">
            9. Changes to this Privacy Policy
          </h2>
          <p className="text-muted-foreground mb-6">
            We may update this Privacy Policy from time to time. We will post
            any changes on this page and update the "Effective Date" above. Your
            continued use of CardSift (Beta) after any changes constitutes your
            acceptance of the new Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">
            10. Contact Us
          </h2>
          <p className="text-muted-foreground mb-6">
            If you have any questions about this Privacy Policy, please contact
            us at
            <a href="mailto:work@pranavbhatkar.me"> work@pranavbhatkar.me</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default PrivacyPolicyPage;
