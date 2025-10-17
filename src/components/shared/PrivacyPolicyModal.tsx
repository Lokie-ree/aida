import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Privacy Policy
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-foreground">
            <div>
              <p className="text-muted-foreground mb-4">
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
              </p>
              <p className="text-muted-foreground">
                Pelican AI is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and protect information when you use our platform.
              </p>
            </div>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Information We Collect</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-foreground">Account Information</h4>
                  <p className="text-muted-foreground">
                    When you create an account, we collect your email address, name, school information, subject area, grade level, and district. This information helps us personalize your experience and ensure our content aligns with Louisiana educational standards.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground">Usage Data</h4>
                  <p className="text-muted-foreground">
                    We track how you interact with our platform, including which frameworks you access, time spent on different sections, and feedback you provide. This helps us improve our services and develop better resources for Louisiana educators.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground">Communication Data</h4>
                  <p className="text-muted-foreground">
                    We collect information from your communications with us, including support requests, feedback, and survey responses.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">FERPA Compliance</h3>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  <strong>Important:</strong> Pelican AI is designed specifically for educators and does not collect, store, or process any student personally identifiable information (PII) as defined by FERPA.
                </p>
                <p className="text-muted-foreground">
                  Our platform focuses on providing guidance and frameworks for educators to use AI tools responsibly. We do not require or encourage the input of student data, and our systems are not designed to handle student information.
                </p>
                <p className="text-muted-foreground">
                  If you choose to use our guidance with student work, you are responsible for ensuring compliance with your school district's FERPA policies and procedures.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">How We Use Your Information</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide personalized AI guidance frameworks aligned with Louisiana standards</li>
                <li>Send you weekly prompt emails and platform updates</li>
                <li>Improve our services based on usage patterns and feedback</li>
                <li>Communicate with you about your account and our services</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Information Sharing</h3>
              <p className="text-muted-foreground mb-3">
                We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>With your explicit consent</li>
                <li>To comply with legal requirements or court orders</li>
                <li>To protect our rights, property, or safety, or that of our users</li>
                <li>With service providers who assist us in operating our platform (under strict confidentiality agreements)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Data Security</h3>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Your Rights</h3>
              <p className="text-muted-foreground mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Contact Us</h3>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or our data practices, please contact us at privacy@pelicanai.org or through our platform's contact form.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Changes to This Policy</h3>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by email or through our platform. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
