type RegistrationData = {
	referenceNumber: string | null;
	incrementId: number;
	fullName: string;
	furigana: string;
	affiliation: string | null;
	position: string | null;
	country: string;
	email: string;
	phone: string;
	attendanceDays: string[];
	reasonsForConference: string[];
	questionsForPanelists: string | null;
	bringChildren: boolean;
	numberOfChildren: number | null;
	requiresNursing: boolean;
	consentToChildcarePolicy: boolean;
	consentToPrivacyPolicy: boolean;
	createdAt: Date;
	updatedAt: Date;
	id: string;
};

export function generateEmailContentJp(data: RegistrationData) {
	if (!data.referenceNumber) {
		throw new Error("Reference number is required for email generation");
	}

	const reasonsText = data.reasonsForConference.join("、");
	const attendanceDaysText = data.attendanceDays.join("、");

	const formDetails = `
  ============================================
  ご登録内容
  ============================================
  氏名：${data.fullName}
  フリガナ：${data.furigana}
  所属機関：${data.affiliation || "未記入"}
  役職：${data.position || "未記入"}
  国：${data.country}
  メールアドレス：${data.email}
  電話番号：${data.phone}
  参加を希望する日にち：${attendanceDaysText}
  本会議を知った理由：${reasonsText}
  お子様の同伴：${data.bringChildren ? "あり" : "なし"}
  お子様の人数：${data.numberOfChildren || "該当なし"}
  託児所の利用希望：${data.requiresNursing ? "あり" : "なし"}
  保育に関する規約への同意：${
		data.consentToChildcarePolicy ? "同意" : "同意なし"
  }
  パネリストへの質問：${data.questionsForPanelists || "なし"}`;

	const mainContent = `
  【自動返信メール】
  タイトル：持続可能な社会のための科学と技術に関する国際会議2025受付完了
  
  登録番号：${data.referenceNumber}
  
  この度は持続可能な社会のための科学と技術に関する国際会議2025にお申込みいただきありがとうございます。
  当日は上記登録番号を会場受付にてご提出ください。
  
  持続可能な社会のための科学と技術に関する国際会議2025
  日時：2026年2月11日、12日
  会場：日本学術会議講堂　https://www.scj.go.jp/ja/other/info.html
  
  当日、顔写真付きの身分証をご持参くださいますようお願い申し上げます。
  (旧姓でご登録の場合は、ご本人確認のため、顔写真つき身分証に併せて、名刺など（登録した苗字が分かるもの）をお持ちください)`;

	const nursingInfo = data.requiresNursing
		? `
  ============================================
  託児所サービスについて（先着順）
  
  託児所サービスをご希望の方は、以下のフォームをご確認の上、ご記入ください。
  
  託児所サービス申込フォーム：${process.env.NEXT_PUBLIC_BASE_URL}/files/nurseryInformationJP.pdf
  ============================================`
		: "";

	const textContent = `${mainContent}${nursingInfo}${formDetails}`;

	const htmlContent = `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
    <pre style="white-space: pre-wrap; font-family: sans-serif;">【自動返信メール】
  タイトル：持続可能な社会のための科学と技術に関する国際会議2025受付完了
  
  登録番号：${data.referenceNumber}
  
  この度は持続可能な社会のための科学と技術に関する国際会議2025にお申込みいただきありがとうございます。
  当日は上記登録番号を会場受付にてご提出ください。
  
  持続可能な社会のための科学と技術に関する国際会議2025
  日時：2026年2月11日、12日
  会場：日本学術会議講堂　<a href="https://www.scj.go.jp/ja/other/info.html" target="_blank">https://www.scj.go.jp/ja/other/info.html</a>
  
  当日、顔写真付きの身分証をご持参くださいますようお願い申し上げます。
  (旧姓でご登録の場合は、ご本人確認のため、顔写真つき身分証に併せて、名刺など（登録した苗字が分かるもの）をお持ちください)</pre>
  
    ${
		data.requiresNursing
			? `
    <div style="margin-top: 20px; padding: 15px; border: 1px solid #ccc; background-color: #f9f9f9;">
      <p style="font-weight: bold;">託児所サービスについて（先着順）</p>
      <p>託児所サービスをご希望の方は、以下のフォームをご確認の上、ご記入ください。</p>
      <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/files/nurseryInformationJP.pdf" target="_blank" style="color: #0066cc; text-decoration: underline;">託児所サービス申込フォーム</a></p>
    </div>
    `
			: ""
	}
  
    <div style="margin-top: 20px; padding: 15px; border: 1px solid #ccc; background-color: #f9f9f9;">
      <h3 style="margin-top: 0;">ご登録内容</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>氏名：</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.fullName
			}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>フリガナ：</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.furigana
			}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>所属機関：</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.affiliation || "未記入"
			}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>役職：</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.position || "未記入"
			}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>国：</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.country
			}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>メールアドレス：</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.email
			}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>電話番号：</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.phone
			}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>参加を希望する日にち：</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${attendanceDaysText}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>本会議を知った理由：</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${reasonsText}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>お子様の同伴：</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.bringChildren ? "あり" : "なし"
			}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>お子様の人数：</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.numberOfChildren || "該当なし"
			}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>託児所の利用希望：</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.requiresNursing ? "あり" : "なし"
			}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>保育に関する規約への同意：</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.consentToChildcarePolicy ? "同意" : "同意なし"
			}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>パネリストへの質問：</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
				data.questionsForPanelists || "なし"
			}</td>
        </tr>
      </table>
    </div>
  </div>`;

	return {
		text: textContent,
		html: htmlContent,
		subject: "持続可能な社会のための科学と技術に関する国際会議2025受付完了",
	};
}
