import { IsInt, Min } from 'class-validator';

export class StatisticSummary {
    @IsInt()
    @Min(0)
    userCount: number;

    @IsInt()
    @Min(0)
    categoryCount: number;

    @IsInt()
    @Min(0)
    goodsCount: number;

    @IsInt()
    @Min(0)
    orderCount: number;

    @IsInt()
    @Min(0)
    parcelCount: number;

    @IsInt()
    @Min(0)
    commentCount: number;
}
