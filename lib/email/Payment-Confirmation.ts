export type PaymentConfirmationData = {
  customerFirstName: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
  serviceType: string;
  county: string;
  caseNumber: string;
  paymentDate: string;
  serviceFee: string;
  estimatedCourtFilingFee: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function paymentConfirmationEmail(
  data: PaymentConfirmationData
): string {
  const customerFirstName = escapeHtml(data.customerFirstName);
  const customerName = escapeHtml(data.customerName);
  const customerEmail = escapeHtml(data.customerEmail);
  const orderId = escapeHtml(data.orderId);
  const serviceType = escapeHtml(data.serviceType);
  const county = escapeHtml(data.county || "Not provided");
  const caseNumber = escapeHtml(data.caseNumber || "Not provided");
  const paymentDate = escapeHtml(data.paymentDate);
  const serviceFee = escapeHtml(data.serviceFee);
  const estimatedCourtFilingFee = escapeHtml(
  data.estimatedCourtFilingFee || "Not provided"  
  );

  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Payment Confirmed | My-Clean-Slate</title>
</head>

<body style="margin:0;padding:0;background-color:#F7F9FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0"
       style="background-color:#F7F9FC;padding:32px 16px;">
  <tr>
    <td align="center">

      <table width="600" cellpadding="0" cellspacing="0" border="0"
             style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #dde3ea;">

        <tr>
          <td style="background-color:#1A3C5E;padding:28px 32px;text-align:center;">
            <div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:1px;margin-bottom:4px;">
              My-Clean-Slate
            </div>

            <div style="font-size:11px;color:#4CAF8C;letter-spacing:2px;text-transform:uppercase;font-weight:600;">
              California Record Relief Document Preparation
            </div>
          </td>
        </tr>

        <tr>
          <td style="background-color:#4CAF8C;height:4px;font-size:0;line-height:0;">
            &nbsp;
          </td>
        </tr>

        <tr>
          <td style="padding:36px 40px 24px;text-align:center;">
            <div style="font-size:28px;font-weight:700;color:#1A3C5E;margin-bottom:8px;">
              Payment Confirmed
            </div>

            <div style="font-size:15px;color:#555555;line-height:1.6;">
              Thank you, ${customerFirstName}. We received your service payment and intake information.
            </div>
          </td>
        </tr>

        <tr>
          <td style="padding:0 40px;">
            <hr style="border:none;border-top:1px solid #e0e6ed;margin:0;">
          </td>
        </tr>

        <tr>
          <td style="padding:28px 40px;font-size:15px;color:#333333;line-height:1.7;">
            <p style="margin:0 0 16px;">
              Hi <strong>${customerFirstName}</strong>,
            </p>

            <p style="margin:0 0 16px;">
              Your payment to My-Clean-Slate has been successfully processed.
              Your intake information has been received for the record-relief
              document preparation service you selected.
            </p>

            <p style="margin:0 0 16px;">
              Our next step is to review the information you provided and prepare
              the appropriate document package based on your selected service and
              intake information.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:8px 0;vertical-align:top;width:28px;font-weight:700;color:#4CAF8C;">
                  1.
                </td>
                <td style="padding:8px 0;font-size:14px;color:#444444;line-height:1.6;">
                  We will review the information submitted in your intake.
                </td>
              </tr>

              <tr>
                <td style="padding:8px 0;vertical-align:top;width:28px;font-weight:700;color:#4CAF8C;">
                  2.
                </td>
                <td style="padding:8px 0;font-size:14px;color:#444444;line-height:1.6;">
                  Your document package will be prepared using the information you provided.
                </td>
              </tr>

              <tr>
                <td style="padding:8px 0;vertical-align:top;width:28px;font-weight:700;color:#4CAF8C;">
                  3.
                </td>
                <td style="padding:8px 0;font-size:14px;color:#444444;line-height:1.6;">
                  If additional information is required, we will contact you using your submitted contact information.
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:0 40px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background-color:#F0F4F8;border:1px solid #ccd5e0;border-left:4px solid #1A3C5E;">
              <tr>
                <td style="padding:20px 24px 8px;font-size:11px;font-weight:700;color:#1A3C5E;letter-spacing:1.5px;text-transform:uppercase;">
                  Payment Confirmation
                </td>
              </tr>

              <tr>
                <td style="padding:4px 24px 20px;">
                  <table width="100%" cellpadding="4" cellspacing="0" border="0"
                         style="font-family:'Courier New',Courier,monospace;font-size:12px;color:#222222;line-height:1.7;">
                    <tr>
                      <td style="color:#666666;width:155px;">Order ID</td>
                      <td style="font-weight:600;">${orderId}</td>
                    </tr>

                    <tr>
                      <td style="color:#666666;">Customer</td>
                      <td>${customerName}</td>
                    </tr>

                    <tr>
                      <td style="color:#666666;">Email</td>
                      <td>${customerEmail}</td>
                    </tr>

                    <tr>
                      <td style="color:#666666;">Service</td>
                      <td>${serviceType}</td>
                    </tr>

                    <tr>
                      <td style="color:#666666;">County</td>
                      <td>${county}</td>
                    </tr>

                    <tr>
                      <td style="color:#666666;">Case Number</td>
                      <td>${caseNumber}</td>
                    </tr>

                    <tr>
                      <td style="color:#666666;">Payment Date</td>
                      <td>${paymentDate}</td>
                    </tr>

                    <tr>
                      <td style="color:#666666;">Service Fee Paid</td>
                      <td style="font-weight:700;font-size:14px;color:#1A3C5E;">
                        ${serviceFee}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
                <tr>
          <td style="padding:0 40px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background-color:#FFF8E7;border:1px solid #f0d080;border-left:4px solid #cc7a00;">
              <tr>
                <td style="padding:18px 20px;">
                  <div style="font-size:12px;font-weight:700;color:#7a5000;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">
                    Court Filing Fee
                  </div>
                  <div style="font-size:13px;color:#555555;line-height:1.6;">
                    Estimated court filing fee:
                    <strong>${estimatedCourtFilingFee}</strong>
                    <br><br>
                    This estimated court filing fee was
                    <strong>not included in the service fee paid today</strong>.
                    Court fees are separate from My-Clean-Slate's document preparation fee
                    and may vary depending on the court and circumstances of the filing.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:0 40px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background-color:#F7F9FC;border:1px solid #dde3ea;">
              <tr>
                <td style="padding:18px 20px;">
                  <div style="font-size:12px;font-weight:700;color:#1A3C5E;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">
                    Important Service Information
                  </div>
                  <div style="font-size:13px;color:#555555;line-height:1.6;">
                    My-Clean-Slate is not a law firm and does not provide legal
                    advice or legal representation.
                    <br><br>
                    My-Clean-Slate provides document preparation services using
                    information supplied by the customer. No court result or
                    record-relief outcome is guaranteed.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:0 40px 32px;font-size:13px;color:#555555;line-height:1.7;">
            <strong style="color:#1A3C5E;">Questions about your order?</strong>
            <br>
            Visit:
            <a href="https://my-clean-slate.com" style="color:#1A3C5E;">
              my-clean-slate.com
            </a>
            <br>
            Please keep your Order ID
            <strong>${orderId}</strong>
            available when contacting us.
          </td>
        </tr>

        <tr>
          <td style="background-color:#1A3C5E;padding:22px 32px;text-align:center;">
            <div style="font-size:10px;color:#9ab0c8;line-height:1.7;">
              My-Clean-Slate LLC is not a law firm and does not provide legal
              advice or legal representation. No attorney-client relationship
              is created by use of the service.
              <br><br>
              Eligibility and the outcome of any request for record relief are
              determined by the applicable court and governing law. No outcome
              is guaranteed.
              <br><br>
              <a href="https://my-clean-slate.com/terms" style="color:#4CAF8C;">
                Terms of Service
              </a>
              &nbsp; | &nbsp;
              <a href="https://my-clean-slate.com/privacy" style="color:#4CAF8C;">
                Privacy Policy
              </a>
              <br><br>
              © 2026 My-Clean-Slate LLC. All rights reserved.
            </div>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
         </body>
</html>
  `;
}   
