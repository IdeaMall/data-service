import { StatisticSummary } from '@ideamall/data-model';
import { Get, JsonController } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import dataSource, {
    Category,
    Comment,
    Goods,
    Order,
    Parcel,
    User
} from '../model';

@JsonController('/statistic')
export class StatisticController {
    @Get()
    @ResponseSchema(StatisticSummary)
    async getStatisticSummary(): Promise<StatisticSummary> {
        const [
            userCount,
            categoryCount,
            goodsCount,
            orderCount,
            parcelCount,
            commentCount
        ] = await Promise.all([
            dataSource.getRepository(User).count(),
            dataSource.getRepository(Category).count(),
            dataSource.getRepository(Goods).count(),
            dataSource.getRepository(Order).count(),
            dataSource.getRepository(Parcel).count(),
            dataSource.getRepository(Comment).count()
        ]);

        return {
            userCount,
            categoryCount,
            goodsCount,
            orderCount,
            parcelCount,
            commentCount
        };
    }
}
