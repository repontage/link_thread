
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'repontage@gmail.com';
  const updatedUser = await prisma.user.update({
    where: { email: email },
    data: { role: 'ADMIN' },
  });
  console.log('Successfully updated user to ADMIN:', updatedUser.email);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
