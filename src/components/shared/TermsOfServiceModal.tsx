import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Terms of Service
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-foreground">
            <div>
              <p className="text-muted-foreground mb-4">
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
              </p>
              <p className="text-muted-foreground">
                Welcome to Pelican AI! These Terms of Service ("Terms") govern your use of our platform designed to empower Louisiana educators with practical, ethical, and platform-agnostic AI guidance.
              </p>
            </div>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Acceptance of Terms</h3>
              <p className="text-muted-foreground">
                By accessing or using Pelican AI, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our platform. We reserve the right to modify these Terms at any time, and your continued use constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Description of Service</h3>
              <p className="text-muted-foreground mb-3">
                Pelican AI provides:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>AI guidance frameworks aligned with Louisiana educational standards</li>
                <li>Platform-agnostic guidance for using ANY AI tool effectively</li>
                <li>Ethical guardrails for responsible AI use in education</li>
                <li>Weekly prompt emails and educational resources</li>
                <li>Community features for sharing innovations and best practices</li>
                <li>Time tracking tools to measure productivity gains</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Eligibility</h3>
              <p className="text-muted-foreground">
                Our platform is designed specifically for Louisiana educators, including teachers, administrators, curriculum specialists, and other educational professionals. By using our service, you represent that you are an educator or educational professional in Louisiana.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">User Responsibilities</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-foreground">Account Security</h4>
                  <p className="text-muted-foreground">
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground">FERPA Compliance</h4>
                  <p className="text-muted-foreground">
                    You are responsible for ensuring that your use of AI tools with student work complies with FERPA and your school district's policies. Pelican AI does not collect or process student personally identifiable information.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground">Appropriate Use</h4>
                  <p className="text-muted-foreground">
                    Use our platform only for lawful educational purposes. Do not use our service to violate any laws, regulations, or school policies.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Intellectual Property</h3>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  The content, features, and functionality of Pelican AI are owned by us and are protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-muted-foreground">
                  You may use our guidance frameworks and resources for your educational purposes. However, you may not reproduce, distribute, or create derivative works without our express written permission.
                </p>
                <p className="text-muted-foreground">
                  Any content you share through our community features remains yours, but you grant us a license to use, display, and distribute such content in connection with our platform.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Privacy and Data Protection</h3>
              <p className="text-muted-foreground">
                Your privacy is important to us. Our collection and use of your information is governed by our Privacy Policy, which is incorporated into these Terms by reference. We are committed to FERPA compliance and do not collect student personally identifiable information.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Beta Program</h3>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  During our beta phase, you may have access to features that are still in development. These features may not be fully functional and may change or be removed without notice.
                </p>
                <p className="text-muted-foreground">
                  We encourage you to provide feedback on beta features to help us improve the platform for all Louisiana educators.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Disclaimers</h3>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  <strong>Educational Guidance Only:</strong> Our platform provides guidance and frameworks for using AI tools in education. We do not guarantee specific outcomes or results from following our guidance.
                </p>
                <p className="text-muted-foreground">
                  <strong>Platform Agnostic:</strong> While we provide guidance for various AI tools, we are not affiliated with or responsible for the functionality, availability, or terms of service of third-party AI platforms.
                </p>
                <p className="text-muted-foreground">
                  <strong>No Warranty:</strong> Our service is provided "as is" without warranties of any kind, either express or implied.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Limitation of Liability</h3>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, Pelican AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses, resulting from your use of our platform.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Termination</h3>
              <p className="text-muted-foreground">
                We may terminate or suspend your account at any time, with or without cause, with or without notice. You may also terminate your account at any time by contacting us or using the account deletion feature in your profile settings.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Governing Law</h3>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of Louisiana, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Contact Information</h3>
              <p className="text-muted-foreground">
                If you have questions about these Terms of Service, please contact us at legal@pelicanai.org or through our platform's contact form.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Changes to Terms</h3>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through our platform. Your continued use of our service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
