const fs = require('fs');
const path = './app/api/comments/route.ts';
let code = fs.readFileSync(path, 'utf8');

const postReplacement = `
    const newComment = await prisma.comment.create({
      data: {
        threadId,
        parentId: parentId || null,
        author,
        content,
        userId: userId,
      }
    });

    // Handle Reply Notification
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
      if (parentComment && parentComment.userId && parentComment.userId !== userId) {
        await prisma.notification.create({
          data: {
            userId: parentComment.userId,
            type: 'reply',
            message: \`\${author}님이 회원님의 댓글에 답글을 남겼습니다: "\${content.substring(0, 30)}..."\`
          }
        });
      }
    }

    // Handle Mention Notifications
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const mentions = Array.from(new Set(Array.from(content.matchAll(mentionRegex), m => m[1])));
    if (mentions.length > 0) {
      const mentionedUsers = await prisma.user.findMany({
        where: { username: { in: mentions } }
      });
      const notificationsData = mentionedUsers
        .filter(u => u.id !== userId)
        .map(u => ({
          userId: u.id,
          type: 'mention',
          message: \`\${author}님이 댓글에서 회원님을 멘션했습니다: "\${content.substring(0, 30)}..."\`
        }));
      if (notificationsData.length > 0) {
        await prisma.notification.createMany({ data: notificationsData });
      }
    }

    return NextResponse.json({ success: true, data: { ...newComment, children: [] } }, { status: 201 });
`;

code = code.replace(/    const newComment = await prisma.comment\.create\(\{\n      data: \{\n        threadId,\n        parentId: parentId \|\| null,\n        author,\n        content,\n        userId: userId,\n      \}\n    \}\);\n\n    return NextResponse\.json\(\{ success: true, data: \{ \.\.\.newComment, children: \[\] \} \}, \{ status: 201 \}\);/, postReplacement);

const patchReplacement = `
    const existingComment = await prisma.comment.findUnique({ where: { id } });
    if (!existingComment) {
      return NextResponse.json({ error: '존재하지 않는 댓글입니다.' }, { status: 404 });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    });

    // Create Upvote Notification
    if (existingComment.userId && existingComment.userId !== (session.user as any).id) {
      await prisma.notification.create({
        data: {
          userId: existingComment.userId,
          type: 'like',
          message: \`누군가 회원님의 댓글을 좋아합니다: "\${existingComment.content.substring(0, 30)}..."\`
        }
      });
    }

    return NextResponse.json({ success: true, data: updatedComment }, { status: 200 });
`;

code = code.replace(/    const existingComment = await prisma\.comment\.findUnique\(\{ where: \{ id \} \}\);\n    if \(!existingComment\) \{\n      return NextResponse\.json\(\{ error: '존재하지 않는 댓글입니다.' \}, \{ status: 404 \}\);\n    \}\n\n    const updatedComment = await prisma\.comment\.update\(\{\n      where: \{ id \},\n      data: \{ upvotes: \{ increment: 1 \} \},\n    \}\);\n\n    return NextResponse\.json\(\{ success: true, data: updatedComment \}, \{ status: 200 \}\);/, patchReplacement);

fs.writeFileSync(path, code);
