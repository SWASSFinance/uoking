import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, FileText, AlertTriangle, CheckCircle, Lock } from "lucide-react"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Privacy Policy - UO King | Data Protection & Privacy Statement",
  description: "Read UO King's privacy policy to understand how we protect your personal information. We never sell or share your data. Secure and confidential handling of all user information.",
  keywords: "privacy policy, data protection, personal information, UO King, Ultima Online, privacy statement, GDPR",
  openGraph: {
    title: "Privacy Policy - UO King | Data Protection & Privacy Statement",
    description: "Read UO King's privacy policy to understand how we protect your personal information. We never sell or share your data. Secure and confidential handling of all user information.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/privacy`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Privacy Policy - UO King | Data Protection & Privacy Statement",
    description: "Read UO King's privacy policy to understand how we protect your personal information. We never sell or share your data. Secure and confidential handling of all user information.",
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label: "Legal", href: "/legal" },
                { label: "Privacy Policy", current: true }
              ]}
            />
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border border-amber-200 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <Lock className="h-12 w-12 text-amber-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Privacy Policy</CardTitle>
              <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>

            <CardContent className="space-y-8">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Please read this privacy policy carefully. By using UOKing, 
                  you consent to the collection and use of your information as described in this policy.
                </AlertDescription>
              </Alert>

              <div className="prose prose-lg max-w-none">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">PRIVACY POLICY</h2>
                  <p className="text-gray-700 mb-4">
                    PLEASE READ THE FOLLOWING CAREFULLY
                  </p>
                  <p className="text-gray-700 mb-4">
                    THIS STATEMENT PROVIDES GENERAL INFORMATION ABOUT THE PRIVACY STATEMENT OF THIS WEBSITE. 
                    IF YOU ARE UNDER 18 YEARS OF AGE, PLEASE BE SURE TO READ THIS PRIVACY STATEMENT WITH 
                    YOUR PARENTS OR GUARDIAN AND ASK THEM QUESTIONS ABOUT WHAT YOU DO NOT UNDERSTAND.
                  </p>
                  <p className="text-gray-700 font-semibold">
                    YOUR USE OF THIS SERVICE CONSTITUTES GIVING ACCEPTANCE AND CONSENT BY YOU OF THIS PRIVACY STATEMENT.
                  </p>
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Introduction</h3>
                    <p className="text-gray-700 mb-3">
                      UO KING (collectively, "UO KING", "we", "our" and "us".) has created this privacy 
                      statement ("Statement") in order to demonstrate its firm commitment to the privacy of 
                      the details that you provide to us when using www.uoking.com ("collectively "the website"), 
                      as the data controller for the purposes of the relevant Massachusetts Data Protection Law 
                      and the EU General Data Protection Regulation (GDPR).
                    </p>
                    <p className="text-gray-700 mb-3">
                      At UO King, we are committed to maintaining the trust and confidence of all visitors to 
                      our website. In particular, we want you to know that the website is not in the business 
                      of selling, renting or trading email lists with other companies and businesses for marketing purposes.
                    </p>
                    <p className="text-gray-700">
                      We believe your business is no one else's. Your Privacy is important to you and to us. 
                      So, we'll protect the information you share with us. To protect your privacy, UO King 
                      follows different principles in accordance with worldwide practices for customer privacy and data protection.
                    </p>
                  </section>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <ul className="list-disc list-inside space-y-2 text-blue-700">
                      <li>We won't sell or give away your name, mail address, phone number, email address or any other information to anyone.</li>
                      <li>We will use state-of-the-art security measures to protect your information from unauthorized users.</li>
                    </ul>
                  </div>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Controller Information</h3>
                    <p className="text-gray-700 mb-3">
                      The Personal Information on the www.uoking.com, is collected, controlled and processed by the data controller; [INSERT NAME] collected on behalf of;
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700"><strong>UO KING</strong></p>
                      <p className="text-gray-700">Address: [INSERT ADDRESS]</p>
                      <p className="text-gray-700">Telephone: [Insert Tel No]</p>
                      <p className="text-gray-700">EMAIL: [INSERT INFO]</p>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">1. INFORMATION WE COLLECT AND OBTAIN</h3>
                    <p className="text-gray-700 mb-3">
                      We obtain personal information about you from a variety of sources. This includes personal 
                      information you provide to us directly, information we obtain from other sources, and 
                      information we gather through automated means.
                    </p>
                    
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Information you provide to us</h4>
                    <p className="text-gray-700 mb-3">
                      When you visit the website or participate in certain services, seek access to certain 
                      content or features, or directly correspond with us, we may collect certain types of 
                      information from you:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Contact information (such as name, postal address, email address and telephone and/or mobile numbers);</li>
                      <li>Your payment information, when needed to facilitate certain transactions;</li>
                      <li>Reviews, comments, and/or surveys on our media blog; and</li>
                      <li>Other information you may provide to us when you fill a form, such as through our "Contact Us" feature.</li>
                    </ul>

                    <h4 className="text-md font-semibold text-gray-800 mb-2 mt-4">Information obtained from other sources</h4>
                    <p className="text-gray-700 mb-3">
                      We may obtain personal information about you in connection with the Services from publicly 
                      and commercially available sources and from our affiliates and/or business partners (such 
                      as advertising networks or social networking services), including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Demographic data (such as gender, age range, educational level, household income range, number of children in household, ethnicity to the extent permitted);</li>
                      <li>Purchasing data, including information about advertisements you have seen or acted upon and information about your interaction with advertisers' products and services;</li>
                      <li>Occupational data (such as profession, position, title, industry; and business address);</li>
                    </ul>

                    <h4 className="text-md font-semibold text-gray-800 mb-2 mt-4">Information Collected by Automated Means</h4>
                    <p className="text-gray-700 mb-3">
                      We may gather by automated means (such as cookies, web beacons, web server logs, 
                      JavaScript and other similar technologies) certain information through our Services:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Your Internet Protocol (IP) address;</li>
                      <li>Device information, including unique identifiers and connection information, including mobile device advertising IDs;</li>
                      <li>Your device type and settings, software used, browser type and operating system;</li>
                      <li>Websites or other services you visited before and after visiting the Services (referring URL);</li>
                      <li>Web pages and advertisements you view and links you click on within the Services;</li>
                      <li>Viewing behavior, including the content you view, how long you view content, and advertisements you have been shown;</li>
                      <li>Dates and times you access or use the Services;</li>
                      <li>Location information, including the city, state and zip code associated with your IP Address;</li>
                      <li>Your phone number and mobile carrier details in connection with our mobile app.</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">2. COOKIES AND SIMILAR TECHNOLOGIES</h3>
                    <p className="text-gray-700 mb-3">
                      Cookies are small files that we or others send to and store on or with your computer 
                      so that your computer, browser, mobile app or other application can be recognized as 
                      unique the next time you access, visit, use or otherwise take advantage of the Services 
                      or other media.
                    </p>
                    <p className="text-gray-700 mb-3">
                      You are always free to decline any cookies we use by adjusting the settings of your 
                      browser, as your browser may permit; however, some products, services or features might 
                      not be available or operate properly if cookies are not enabled.
                    </p>
                    <p className="text-gray-700">
                      In addition, we, our service providers and others sometimes use data-gathering mechanisms 
                      on the Services, including without limitation "web beacons", "clear GIFs", "pixels" and/or "tags". 
                      These perform statistical and administrative functions, such as measuring site and page traffic, 
                      verifying advertising paths, better understanding user interests and activity, and positioning images.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">3. HOW WE USE THE INFORMATION WE OBTAIN</h3>
                    <p className="text-gray-700 mb-3">
                      We, or service providers acting on our behalf, may use the information collected from 
                      and about you to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Provide our services, including authorizing a purchase, or completing a transaction that you requested;</li>
                      <li>Send promotional materials as well as running Facebook Ads, alerts regarding available offers and other communications;</li>
                      <li>Communicate about, and administer participation in, special events, promotions, programs, offers, surveys, contests and market research;</li>
                      <li>Respond to inquiries from you and other third-parties, including inquiries from law enforcement agencies;</li>
                      <li>Anonymize or de-identify personal information to provide third parties with aggregated data reports;</li>
                      <li>Provide technical support;</li>
                      <li>Generate suggestions about the type of content you may enjoy;</li>
                      <li>Supplement your personal information collected directly from you with additional information from publicly and commercially available sources;</li>
                      <li>Associate your browser and/or device with other browsers or devices you use for the purpose of providing relevant content;</li>
                      <li>Operate, evaluate and improve our business;</li>
                      <li>Protect against, identify and prevent fraud and other unlawful activity, claims and other liabilities;</li>
                      <li>Comply with and enforce applicable legal requirements, relevant industry standards, contractual obligations and our terms of service;</li>
                      <li>In other ways for which we provide specific notice at the time of collection.</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">4. DISCLOSURE OF YOUR PERSONAL INFORMATION</h3>
                    <p className="text-gray-700 mb-3">
                      We may disclose your personal information to selected third parties, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Third party service providers who perform services on our behalf, such as providers of IT and email distribution services;</li>
                      <li>Advisors such as accountants, lawyers, and consultants;</li>
                      <li>In the event that we sell or buy any business or assets, the prospective seller or buyer of such business or assets;</li>
                      <li>If we or substantially all of our assets are acquired by a third party, to the relevant third party;</li>
                      <li>Analytics providers that assist us in the improvement and optimization of our Websites;</li>
                      <li>Law enforcement agencies or other third parties for the purposes described below.</li>
                    </ul>
                    <p className="text-gray-700">
                      We may also disclose your personal information to third parties if we are under a duty 
                      to disclose or share your personal information in order to comply with any legal obligation, 
                      or in order to enforce or apply our Website Terms of Use, our Terms and Conditions and 
                      other agreements, or to protect the rights, property, or safety of our customers, or others.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">5. HOW WE HOLD AND PROTECT YOUR PERSONAL INFORMATION</h3>
                    <p className="text-gray-700 mb-3">
                      How we keep your personal information secure are as follows:
                    </p>
                    <p className="text-gray-700 mb-3">
                      We will take all steps reasonably necessary to ensure that your personal information is 
                      treated securely and in accordance with this privacy policy.
                    </p>
                    <p className="text-gray-700 mb-3">
                      All information you provide to us is stored on our secure servers. Any payment transactions 
                      will be carried out by third parties over encrypted connections. Where we have given you 
                      (or where you have chosen) a password or API key which enables you to access certain parts 
                      of our site, you are responsible for keeping this password or API key confidential.
                    </p>
                    <p className="text-gray-700">
                      Unfortunately, the transmission of information via the internet is not completely secure. 
                      Although we will do our best to protect your personal information, we cannot guarantee the 
                      security of your data transmitted to our site and any transmission is at your own risk. 
                      Once we have received your information, we will use strict procedures and security features 
                      to try to prevent unauthorized access.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">6. OUR RETENTION OF YOUR PERSONAL INFORMATION</h3>
                    <p className="text-gray-700">
                      The periods for which we keep your information depend on why your information was collected 
                      and what we use it for. We will not keep your personal information for longer than necessary 
                      other than for our business purposes or for legal requirements.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">7. WHAT ARE YOUR RIGHTS TO YOUR DATA?</h3>
                    <p className="text-gray-700 mb-3">
                      All Your Personal Information we collect will always belong to you. However, we are a 
                      collector and a processor of Your Personal Information. That implies on us obligations 
                      to respect your rights to Personal Information and facilitate the exercise of your rights thereto.
                    </p>
                    <p className="text-gray-700 mb-3">
                      In order to use any of your rights at any time please contact us and we will facilitate 
                      the exercise of your rights free of charge. We will inform you on the actions taken by 
                      us under your request as soon as practically possible, but in any case, not later than 
                      in 30 (thirty) calendar days.
                    </p>
                    <p className="text-gray-700 mb-3">
                      In accordance with effective regulations you have a significant number of rights related 
                      to your Personal Information, such as:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li><strong>Right to access.</strong> You may obtain from us the confirmation as to whether or not personal data concerning you is being processed and get an access to such personal data.</li>
                      <li><strong>Right to rectify</strong> your inaccurate Personal Information and to have incomplete personal data completed.</li>
                      <li><strong>Right to erase</strong> your Personal Information. Please note that a request to erase your Personal Information will also terminate your account on the Site.</li>
                      <li><strong>Right to restrict processing</strong> of your Personal Information;</li>
                      <li><strong>Right to data portability.</strong> You may obtain from us the personal data concerning you and transmit it to another Personal Information Controller;</li>
                      <li><strong>Right to object</strong> to processing of Your Personal Information;</li>
                      <li><strong>Right to withdraw your consent</strong> to the usage of your Personal Information at any time;</li>
                      <li><strong>Right to lodge a complaint.</strong> We take privacy concerns seriously. If you believe that we have not complied with this Privacy Policy, you may contact our respective Data Protection Office.</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">8. GOOGLE ANALYTICS</h3>
                    <p className="text-gray-700">
                      When someone visits the website, we use a third-party service, Google Analytics, to 
                      collect standard internet log information and details of visitor behavior patterns. 
                      We do this to track things such as the number of visitors to the various parts of 
                      the site and interactions with the site. This information is processed in a way which 
                      does not identify anyone. We do not make and do not allow Google to make, any attempt 
                      to find out the identities of visitors to our website.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">9. SECURING PRIVACY</h3>
                    <p className="text-gray-700">
                      To transfer data between our websites, our applications and backends, communication is 
                      encrypted using the SSL (Secure Socket Layer) encryption. We protect the systems and 
                      processing by a series of technical and organizational measures. These include data 
                      encryption, pseudonymization and anonymization, logical and physical access restriction 
                      and control, firewalls and recovery systems, and integrity testing. Our employees are 
                      regularly trained in the sensitive handling of personal data and are obliged to observe 
                      data secrecy in accordance with legal requirements.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">10. MINORS</h3>
                    <p className="text-gray-700">
                      We do not knowingly gather or otherwise process personal data of minors under the age 
                      of 16. If we notice that one of our users/visitors is a minor we'll immediately take 
                      steps to remove their information. If you believe we have processed or still hold 
                      information on minors, please send us an email at [INSERT INFO] and we will remove it A.S.A.P.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">11. CHANGES IN THE PRIVACY STATEMENT</h3>
                    <p className="text-gray-700">
                      The effective date at the bottom of this page indicates when this Privacy Statement 
                      was last revised. We will notify you before any material change takes effect so that 
                      you have time to review the changes. Any change is effective when we post the revised 
                      Privacy Statement. Your use of the Services following these changes means that you 
                      accept the revised Privacy Statement.
                    </p>
                  </section>
                </div>

                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Contact Information</h4>
                  </div>
                  <p className="text-green-700">
                    If you have any questions about this Privacy Policy or how we handle your personal information, 
                    please feel free to contact us. We're committed to protecting your privacy and will respond 
                    to your inquiries promptly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
} 