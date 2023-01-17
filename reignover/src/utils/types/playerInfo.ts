export interface IPlayerBuilding {
    name: string
    description: string
    level: number
    levelRequirements: boolean[] | any
    timeRequirements: number
    resourceRequirements: number[]
    hasResources: boolean[]
    constructionTime: number
}