// lib/multica.ts

const MULTICA_TOKEN = process.env.MULTICA_TOKEN;
const WORKSPACE_ID = process.env.MULTICA_WORKSPACE_ID;
const PROJECT_ID = process.env.MULTICA_PROJECT_ID;

const REVIEW_AGENT_ID = "d8c183f1-63a3-48f0-8586-7a91bf1febca";
const REVIEW_AGENT_NAME = "code reviewung agent (Copy)";
// const CODEX_AGENT_ID = "b302f90d-5128-4c17-9be6-fa831fc96959";
// const CODEX_AGENT_NAME = "Codex";
const ATLAS_AGENT_ID = "4bb7d1ed-a137-4355-af90-47cec839d7cc";

export async function reportErrorToMultica(title: string, details: string) {
  if (!MULTICA_TOKEN || !WORKSPACE_ID || !PROJECT_ID) {
    console.warn("Multica environment variables (TOKEN, WORKSPACE_ID, PROJECT_ID) are not fully defined.");
    return;
  }

  const payload = {
    title: `🚨 [Server Error] ${title}`,
    description: details,
    project_id: PROJECT_ID,
    status: "todo",
    priority: "high",
  };

  try {
    const response = await fetch(`https://api.multica.ai/api/issues?workspace_id=${WORKSPACE_ID}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MULTICA_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Multica API Error (Create Issue):", errorText);
      return null;
    }

    const issue = await response.json();
    const issueId = issue.id;
    console.log("Multica Issue Created:", issueId);

    // 1. Initial trigger: Mention ONLY the Code Review Agent to start the review process.
    const mentionReview = `[${REVIEW_AGENT_NAME}](mention://agent/${REVIEW_AGENT_ID})`;
    const mentionAtlas = `[Atlas](mention://agent/${ATLAS_AGENT_ID})`;
    
    const commentPayload = {
      content: `Cc: ${mentionReview}\n\n이 서버 에러 이슈를 확인하고 코드를 리뷰해주세요. 리뷰 완료 후 ${mentionAtlas}를 멘션하여 수정을 요청해주시기 바랍니다. 수정한 Atlas는 다시 리뷰 에이전트에게 확인을 요청하고, 최종 완료되면 이슈를 'done'으로 변경 후 텔레그램으로 알려주세요.`,
    };

    const commentResponse = await fetch(`https://api.multica.ai/api/issues/${issueId}/comments?workspace_id=${WORKSPACE_ID}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MULTICA_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentPayload),
    });

    if (!commentResponse.ok) {
      console.error("Multica API Error (Create Comment):", await commentResponse.text());
    } else {
      console.log("Multica Comment with Mentions Created for Issue:", issueId);
    }

    return issue;
  } catch (error) {
    console.error("Error reporting to Multica:", error);
    return null;
  }
}
