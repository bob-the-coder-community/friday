export interface IRunner {
    job_id: string;
    timestamps: {
        start: Date;
        end: Date;
    };
    totalCandidates: number;
}
