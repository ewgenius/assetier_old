import { OrganizationPlanType, OrganizationType, Role } from "lib-prisma";
import { NotAllowedError } from "@utils/httpErrors";
import { prisma } from "@utils/prisma";
import { withUser } from "@utils/withUser";

export default withUser(async ({ method, user, body }, res) => {
  switch (method) {
    case "POST": {
      let plan = await prisma.organizationPlan.findUnique({
        where: {
          planType_active: {
            planType: OrganizationPlanType.TEAM_TRIAL,
            active: true,
          },
        },
      });

      if (!plan) {
        plan = await prisma.organizationPlan.create({
          data: {
            name: "Trial",
            planType: OrganizationPlanType.TEAM_TRIAL,
          },
        });
      }

      console.log(body);

      const { id: newOrganizationId } = await prisma.organization.create({
        data: {
          name: body.name,

          type: OrganizationType.TEAM,
          organizationPlanId: plan.name,
        },
      });

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          organizations: {
            create: {
              isPersonal: false,
              role: Role.ADMIN,
              organizationId: newOrganizationId,
            },
          },
        },
      });

      const organization = await prisma.organization.findUnique({
        where: {
          id: newOrganizationId,
        },
        include: {
          organizationPlan: true,
        },
      });

      return res.status(200).json(organization);
    }

    default: {
      throw new NotAllowedError();
    }
  }
});
