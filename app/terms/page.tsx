import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, FileText, AlertTriangle, CheckCircle } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label: "Legal", href: "/legal" },
                { label: "Terms & Conditions", current: true }
              ]}
            />
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border border-amber-200 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <FileText className="h-12 w-12 text-amber-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Terms and Conditions</CardTitle>
              <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>

            <CardContent className="space-y-8">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Please read these terms carefully before using our services. 
                  By accessing or using UOKing, you agree to be bound by these terms.
                </AlertDescription>
              </Alert>

              <div className="prose prose-lg max-w-none">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">TERMS AND CONDITIONS</h2>
                  <p className="text-gray-700 mb-4">
                    This agreement is between you ["User" or "you"] and UO KING (Collectively, "UO KING", "we", "our" and "us".)
                  </p>
                  <p className="text-gray-700">
                    The following terms of service (these "Terms of Service"), govern your access to and use of UO KING services, 
                    including any content, functionality and services offered on or through www.uoking.com (the "Site or website")
                  </p>
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">1. USAGE/ ELIGIBILITY</h3>
                    <p className="text-gray-700">
                      You will use this site in a manner consistent with any, and all, applicable laws, legislation, rules and regulations. 
                      If you violate any restrictions in these terms, you agree to indemnify UO KING for any losses, costs or damages, 
                      including reasonable legal fees, incurred by UO KING in relation to, or arising out of, such a breach.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">2. ACCEPTANCE OF TERMS</h3>
                    <p className="text-gray-700 mb-3">
                      These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity 
                      ("you" or "your" or "user") and UO KING ( "we", "us" or "our"), concerning your access to and use of www.uoking.com. 
                      You agree that by accessing the Site, you have read, understood, and agree to be bound by the terms and conditions and 
                      Privacy Policy incorporated.
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 font-semibold">
                        IF YOU DO NOT AGREE WITH ALL OF THESE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
                      </p>
                    </div>
                    <p className="text-gray-700 mt-3">
                      In these Terms, "you" and "your" refer to the individual or entity that uses the Site, or Services. "UOKING", "We", "us", 
                      or "our" refer to UO KING. In addition, in these Terms, unless the context requires otherwise, words in one gender include 
                      all genders and words in the singular include the plural and vice-versa.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">3. ABOUT "UO KING" SERVICES</h3>
                    <p className="text-gray-700 mb-3">
                      UO KING is a corporation carrying on its business activities in Massachusetts, U.S.. The services we render include premium Ultima Online items, gold, and gaming services.
                    </p>
                    <div className="space-y-2">
                      <p className="text-gray-700"><strong>Who is our service for?</strong></p>
                      <p className="text-gray-700">Our services are designed for Ultima Online players who seek premium items, gold, and gaming services.</p>
                      <p className="text-gray-700"><strong>How to Use the Service?</strong></p>
                      <p className="text-gray-700">Browse our catalog, select your desired items, complete the purchase, and receive your items through our secure delivery system.</p>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">4. EXCLUSION OF LIABILITY FOR EXTERNAL LINKS</h3>
                    <p className="text-gray-700 mb-3">
                      To provide a seamless service to you, we make use of external service providers. Some of the external sites linked to the 
                      service include payment processors and authentication services. When signing up, we may link your accounts with these external sites.
                    </p>
                    <p className="text-gray-700">
                      The Website may provide links to external Internet sites. UO KING declares explicitly that it has no influence on the layout 
                      or content of linked pages and dissociates itself expressly from all contents of all linked pages of third parties. UO KING 
                      shall not be liable for the use or content of Internet sites that link to this site or which are linked from it. We also 
                      advise that you familiarize yourself with the terms and privacy policy of these external sites linked to our website. Our 
                      privacy and cookie notice do not apply to any collection and processing of your personal data on or through such external sites.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">5. INTELLECTUAL PROPERTY</h3>
                    <p className="text-gray-700 mb-3">
                      Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, 
                      website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, 
                      service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected 
                      by copyright and trademark laws and various other intellectual property rights and unfair competition laws of the US, foreign 
                      jurisdictions, and international conventions.
                    </p>
                    <p className="text-gray-700">
                      The Content and the Marks are provided on the Site "AS IS" for your information and personal use only. Except as expressly 
                      provided in these Terms of Use, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, 
                      uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, licensed, or otherwise exploited for any 
                      commercial purpose whatsoever, without our express prior written permission.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">6. YOUR REPRESENTATIONS</h3>
                    <p className="text-gray-700 mb-3">
                      By using the Site, you represent and warrant that:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                      <li>All registration information you submit will be true, accurate, current, and complete;</li>
                      <li>You will maintain the accuracy of such information and promptly update such registration information as necessary;</li>
                      <li>You have the legal capacity and you agree to comply with these Terms of Use</li>
                      <li>You are not under the age of 18;</li>
                      <li>You are not a minor in the jurisdiction of which you reside, or if a minor, you have received parental permission to use the Site;</li>
                      <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise;</li>
                      <li>You will not use the Site for any illegal or unauthorized purpose and</li>
                      <li>Your use of the Site will not violate any applicable law or regulation.</li>
                    </ol>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">7. ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION</h3>
                    <p className="text-gray-700">
                      We are not responsible if information made available on this site is not accurate, complete or current. The material on this 
                      site is provided for general information only and should not be relied upon or used as the sole basis for making decisions 
                      without consulting primary, more accurate, more complete or timelier sources of information. Any reliance on the material on 
                      this site is at your own risk.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">8. YOUR ACCOUNT</h3>
                    <p className="text-gray-700 mb-3">
                      Users can access the site without creating an account, however, to enjoy the benefits of the service provided on the site, 
                      we would require you to create an account on the website. Your username and password will be chosen by you. You are responsible 
                      for all actions taken under your chosen username and password.
                    </p>
                    <p className="text-gray-700 mb-3">By creating an account on the Site, you warrant:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>That all the details you provide are true, accurate, current and complete in all respects;</li>
                      <li>To only create one (1) account and to only use the Site using your own username and password;</li>
                      <li>Not to disclose your password to anyone and to make every effort to keep your password safe;</li>
                      <li>To change your password immediately upon discovering that your account has been compromised; and</li>
                      <li>To notify us if you suspect someone has accessed your account without permission.</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">9. USER LICENSES</h3>
                    <p className="text-gray-700 mb-3">
                      In consideration for your acceptance of this Agreement and your payment of all applicable Fees (as defined accordingly), 
                      UO KING grants you a personal, limited, non-exclusive, non-sublicensable, non-transferable, revocable license to access 
                      and use the Site, the Services and the Software solely for your own personal purposes.
                    </p>
                    <p className="text-gray-700 mb-3">
                      You may access and use the Site, Services and Software only in accordance with any instruction manuals, user guides and 
                      other documentation as made available by UO KING from time to time ("Documentation").
                    </p>
                    <p className="text-gray-700 mb-3">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                      <li>modify or copy the materials;</li>
                      <li>attempt to decompile or reverse engineer any software contained on UO KING website;</li>
                      <li>remove any copyright or other proprietary notations from the materials; or</li>
                      <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                    </ol>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">10. PRICING</h3>
                    <p className="text-gray-700 mb-3">
                      For more information on our Pricing, please visit our website https://www.uoking.com/prices.
                    </p>
                    <p className="text-gray-700 mb-3">
                      We use Stripe Checkout for all payments on the platform. Charges shall be on a per-purchase basis. 
                      You authorize us to charge your credit cards for your purchases. However, we provide you with the option to cancel 
                      the service at any time. Cancellation during a billing period would not affect the service we have initially billed 
                      you for until expiration.
                    </p>
                    <p className="text-gray-700">
                      You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. 
                      You further agree to promptly update account and payment information, including email address, billing/mailing address, 
                      payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. 
                      We bill you through an online billing account for purchases made via the Site. Sales tax will be added to the price of 
                      purchases as deemed required by us. We may change prices at any time. All payments shall be in US Dollars.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">11. INDEMNIFICATION</h3>
                    <p className="text-gray-700">
                      To the fullest extent permitted by applicable law, you agree to indemnify, defend and hold harmless UO KING, and our 
                      respective past, present and future employees, officers, directors, contractors, consultants, equity holders, suppliers, 
                      vendors, service providers, parent companies, subsidiaries, affiliates, agents, representatives, predecessors, successors 
                      and assigns (individually and collectively, the "UO KING Parties"), from and against all actual or alleged UO King Party 
                      or third party claims, damages, awards, judgments, losses, liabilities, obligations, penalties, interest, fees, expenses 
                      (including, without limitation, attorneys fees and expenses) and costs (including, without limitation, court costs, costs 
                      of settlement and costs of pursuing indemnification and insurance), of every kind and nature whatsoever, whether known or 
                      unknown, foreseen or unforeseen, matured or immature, or suspected or unsuspected, in law or equity, whether in tort, 
                      contract or otherwise (collectively, "Claims"), including, but not limited to, damages to property or personal injury, 
                      that are caused by, arise out of or are related to (a) your use or misuse of the Site, Content or Services, (b) any 
                      Feedback you provide, (c) your violation of these Terms, (d) your violation of the rights of another, (e) any third 
                      partys use or misuse of the Site or Services provided to you and (f) any User Content you create, post, share or store 
                      on or through the Site or our pages or feeds on third party social media platforms.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">12. PROHIBITED USES</h3>
                    <p className="text-gray-700 mb-3">
                      You may not access or use the Site for any purpose other than that for which we make available. The site may not be used 
                      in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                    </p>
                    <p className="text-gray-700 mb-3">As a user of the Site, you agree not to:</p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                      <li>Make any unauthorized use of the Site, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretences.</li>
                      <li>Do anything that promotes pornography, hatred, racism, terrorism, drugs, hate speeches or promote anything which violates any legislation in the United States or related municipal and international laws and conventions.</li>
                      <li>Do anything which is likely to infringe on any existing copyrights, supplying or selling of copyrighted or pirated materials.</li>
                      <li>Make/create any content which is discriminatory or centered around hatred or belittling other faiths.</li>
                      <li>Circumvent, disable, or otherwise interfere with security-related features of the Site, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Site and/or the Content contained therein.</li>
                      <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as (but not limited to) user passwords.</li>
                      <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
                      <li>Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
                      <li>Interfere with, disrupt, or create an undue burden of the Site or the networks or services connected to the Site.</li>
                      <li>Attempt to impersonate another user or person or use the username of another user.</li>
                      <li>Use any information obtained from the Site in order to harass, abuse, or harm another person.</li>
                      <li>Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Site.</li>
                      <li>Attempt to bypass any measures of the Site designed to prevent or restrict access to the Site, or any portion of the Site.</li>
                      <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Site to you.</li>
                      <li>Delete the copyright or other proprietary rights notice from any Content.</li>
                      <li>Copy or adapt the Site's software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.</li>
                      <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any parties' functions, operation, or maintenance of the Site.</li>
                      <li>Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats ("gifs"), 1x1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as "spyware" or "passive collection mechanisms" or pcms").</li>
                      <li>Except as may be the result of standard search engine or Internet browser usage, use launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Site, or using or launching any unauthorized script or other software.</li>
                      <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site.</li>
                      <li>Use the Site in a manner inconsistent with any applicable laws or regulations.</li>
                      <li>Use content without proper attribution</li>
                      <li>Use content in a fashion that does not comply with the content's specific licensing</li>
                    </ol>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">13. DISCLAIMERS</h3>
                    <p className="text-gray-700 mb-3">
                      Your access to and use of the services and content provided on www.uoking.com are at YOUR OWN RISK. You understand and 
                      agree that the Services are provided to you on an "AS IS" and "AS AVAILABLE" basis. Without limiting the foregoing, to 
                      the maximum extent permitted under applicable law, (UO KING ENTITIES include UO King founders, officers, directors, 
                      employees, agents, representatives, and partners) DISCLAIM ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS OR IMPLIED, 
                      OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, and OR NON-INFRINGEMENT.
                    </p>
                    <p className="text-gray-700">
                      UO King make no warranty and disclaim all responsibility and liability for: (i) the completeness, accuracy, availability, 
                      timeliness, security or reliability of the Services or any Content; (ii) any harm to your computer system, loss of data, 
                      or other harm that results from your access to or use of the Services or any Content; (iii) the deletion of, or the 
                      failure to store or to transmit, any Content and other communications maintained by the Services; and (iv) whether the 
                      Services will meet your requirements or be available on an uninterrupted, secure, or error-free basis. No advice or 
                      information, whether oral or written, obtained from UO King or through the Services, will create any warranty not 
                      expressly made herein.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">14. CHANGES</h3>
                    <p className="text-gray-700">
                      If UO KING decides to change these general terms and conditions, we will post the changed terms and conditions on the 
                      Website. You are advised to regularly check whether they have changed. Existing contracts will not be affected by such changes.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">15. GOVERNING LAW AND JURISDICTION</h3>
                    <p className="text-gray-700">
                      This general terms and conditions in relation to the use of www.uoking.com is hereby governed by, and constructed and 
                      enforced in accordance with the laws of Massachusetts, US. The competent courts in Massachusetts, US shall have the 
                      exclusive jurisdiction to resolve any dispute between you and UO King.
                    </p>
                  </section>
                </div>

                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Contact Information</h4>
                  </div>
                  <p className="text-green-700">
                    If you have any questions about these Terms and Conditions, please feel free to contact us. 
                    We're here to help clarify any concerns you may have about our services and policies.
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