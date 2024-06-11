
export enum LinkPrecedence {
    Primary = 'primary',
    Secondary = 'secondary',
}
  
  // Interface for Contact model
export interface ContactType {
    id: number;
    phoneNumber?: string | null; // Optional field
    email?: string | null; // Optional field
    linkedId?: number | null; // Optional field
    linkPrecedence: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null; // Optional field
}
  