import prisma from './lib/prisma';
async function test() {
  console.log(await prisma.comment.count());
}
test();
