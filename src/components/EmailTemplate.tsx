type EnglishRegistrationData = {
	referenceNumber: string | null;
	incrementId: number;
	title: string | null;
	otherTitle: string | null;
	firstName: string;
	middleName: string | null; // Added middleName field
	lastName: string;
	position: string | null;
	affiliation: string | null;
	country: string;
	email: string;
	phone: string;
	attendanceDays: string[];
	reasonsForConference: string[];
	questionsForPanelists: string | null;
	bringChildren: boolean;
	numberOfChildren: number | null;
	requiresNursing: boolean;
	consentToPrivacyPolicy: boolean;
	consentToChildcarePolicy: boolean;
	createdAt: Date;
	updatedAt: Date;
	id: string;
};

export function generateEmailContent(data: EnglishRegistrationData) {
	if (!data.referenceNumber) {
		throw new Error("Reference number is required for email generation");
	}

	const reasonsText = data.reasonsForConference.join(", ");
	const attendanceDaysText = data.attendanceDays.join(", ");
	const fullTitle = data.title === "Other" ? data.otherTitle : data.title;

	const formDetails = `
  ============================================
  Registration Details
  ============================================
  Title: ${fullTitle || "Not provided"}
  First Name: ${data.firstName}
  Middle Name: ${data.middleName || "Not provided"}
  Last Name: ${data.lastName}
  Affiliation: ${data.affiliation || "Not provided"}
  Position: ${data.position || "Not provided"}
  Country: ${data.country}
  Email: ${data.email}
  Phone: ${data.phone}
  Attendance Days: ${attendanceDaysText}
  How did you learn about the conference: ${reasonsText}
  Bringing children: ${data.bringChildren ? "Yes" : "No"}
  Number of children: ${data.numberOfChildren || "Not applicable"}
  Childcare service required: ${data.requiresNursing ? "Yes" : "No"}
  Questions for Panelists: ${data.questionsForPanelists || "None"}`;

	const mainContent = `
  [Automated Reply]
  Subject: Registration Confirmation - International Conference on Science and Technology for Sustainability 2025
  
  Reference Number: ${data.referenceNumber}
  
  Thank you for registering for the International Conference on Science and Technology for Sustainability 2025.
  Please present this reference number at the reception desk on the day of the conference.
  
  International Conference on Science and Technology for Sustainability 2025
  Date & Time: TBD
  Venue: Science Council of Japan　https://www.scj.go.jp/en/scj/access.html
  
  Please present this reference number along with a valid photo ID at the reception desk on the day of the conference`;

	const nursingInfo = data.requiresNursing
		? `
  ============================================
  Childcare Service Information (First-come, first-served basis)
  
  For those who require childcare services:
  Please make a reservation by E-mail, including the information below.
  We will reply by e-mail to confirm your reservation with an application form attached.
  Please fill out the form and bring it on the actual day of your use.
  
  ■ E-mail: yoyaku@alpha-co.com
  
  For more information, please check the following form:
  https://drive.google.com/file/d/1xlFUiMJlN6DtsN13nRNdbPojx4aTBDHO/view?usp=sharing
  ============================================`
		: "";

	const textContent = `${mainContent}${nursingInfo}${formDetails}`;

	const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
      <pre style="white-space: pre-wrap; font-family: sans-serif;">[Automated Reply]
  Subject: Registration Confirmation - International Conference on Science and Technology for Sustainability 2025
  
  Reference Number: ${data.referenceNumber}
  
  Thank you for registering for the International Conference on Science and Technology for Sustainability 2025.
  Please present this reference number at the reception desk on the day of the conference.
  
  International Conference on Science and Technology for Sustainability 2025
  Date & Time: TBD
  Venue: Science Council of Japan　<a href="https://www.scj.go.jp/en/scj/access.html" target="_blank">https://www.scj.go.jp/en/scj/access.html</a>
  
  Please present this reference number along with a valid photo ID at the reception desk on the day of the conference.</pre>
  
      ${
			data.requiresNursing
				? `
      <div style="margin-top: 20px; padding: 15px; border: 1px solid #ccc; background-color: #f9f9f9;">
        <p style="font-weight: bold;">Childcare Service Information (First-come, first-served basis)</p>
        <p>For those who require childcare services:<br>
        Please make a reservation by E-mail, including the information below.<br>
        We will reply by e-mail to confirm your reservation with an application form attached.<br>
        Please fill out the form and bring it on the actual day of your use.</p>
        <p>■ E-mail: <a href="mailto:yoyaku@alpha-co.com">yoyaku@alpha-co.com</a></p>
        <p>For more information, please check the following form:<br>
        <a href="https://drive.google.com/file/d/1xlFUiMJlN6DtsN13nRNdbPojx4aTBDHO/view?usp=sharing" target="_blank">Childcare Service Application Form</a></p>
      </div>
      `
				: ""
		}
    
      <div style="margin-top: 20px; padding: 15px; border: 1px solid #ccc; background-color: #f9f9f9;">
        <h3 style="margin-top: 0;">Registration Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Title:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				fullTitle || "Not provided"
			}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>First Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.firstName
			}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Middle Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.middleName || "Not provided"
			}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Last Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.lastName
			}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Affiliation:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.affiliation || "Not provided"
			}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Position:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.position || "Not provided"
			}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Country:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.country
			}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.email
			}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.phone
			}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Attendance Days:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${attendanceDaysText}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>How did you learn about the conference:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${reasonsText}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Bringing children:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.bringChildren ? "Yes" : "No"
			}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Number of children:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.numberOfChildren || "Not applicable"
			}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Childcare service required:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.requiresNursing ? "Yes" : "No"
			}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Questions for Panelists:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.questionsForPanelists || "None"
			}</td>
          </tr>
        </table>
      </div>
    </div>`;

	return {
		text: textContent,
		html: htmlContent,
		subject:
			"Registration Confirmation - International Conference on Science and Technology for Sustainability 2025",
	};
}
