import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { LinkPrecedence, ContactType} from '../models/contact';
import { isExactMatch, primaryMatch }  from '../utils/match';

const prisma = new PrismaClient();

interface ResultObj {
    primaryContatctId: number,
    emails: string[],
    phoneNumbers: string[],
    secondaryContactIds: number[]
}

interface Result {
    contact: ResultObj
}

const add = async (req: Request, res: Response) => {
    try {
    const {email, phoneNumber} = req.body;


    // Check if both email and phoneNumber are provided
    if (email == null && phoneNumber == null) {
        return res.status(400).json({
        message: 'Both email and phoneNumber cannot be null or undefined'
        });
    }

    let allContacts: Array<ContactType> = await prisma.$queryRaw`
        SELECT * 
        FROM "Contact"
        WHERE "linkedId" = (
        SELECT "linkedId" 
        FROM "Contact"
        WHERE ("email" = ${email} OR "phoneNumber" = ${phoneNumber}) 
            AND "linkedId" IS NOT NULL
        LIMIT 1
        )
        OR "id" = (
        SELECT "linkedId" 
        FROM "Contact"
        WHERE ("email" = ${email} OR "phoneNumber" = ${phoneNumber}) 
            AND "linkedId" IS NOT NULL
        LIMIT 1
        )
        ORDER BY "createdAt" DESC;
  `;
  
    let primaryId = allContacts.find((element)=>{
        return element.linkPrecedence === LinkPrecedence.Primary;
    })?.id ?? 0;
    if(allContacts.length===0){
        let newContact : ContactType = await prisma.contact.create({
            data: {
              email: email,
              phoneNumber: phoneNumber,
              linkPrecedence: LinkPrecedence.Primary,
            }
        });

        if(!newContact){
            throw new Error('Action can not be done');
        }

        allContacts.push(newContact);
        primaryId = newContact.id;
    } else {
        if(!isExactMatch({email, phoneNumber}, allContacts)) {
            let newContact : ContactType = await prisma.contact.create({
                data: {
                    email: email,
                    phoneNumber: phoneNumber,
                    linkPrecedence: LinkPrecedence.Secondary,
                }
            });

            if(!newContact){
                throw new Error('Action can not be done');
            }

            primaryId = newContact.id;

        }
        let primaryMatches = primaryMatch(allContacts);
        if(primaryMatches.length>1){
            let editedElement = await prisma.contact.update({
                where: {
                    id: primaryMatches[1].id,
                },
                data: {
                    linkPrecedence: LinkPrecedence.Secondary
                },
            });
            allContacts = allContacts.map((contact)=>{
                if(contact.id===editedElement.id){
                    contact.linkPrecedence = LinkPrecedence.Secondary;
                }
                return contact;
            })
        } 
    }

    const initialResponseObj: ResultObj = {
        primaryContatctId: primaryId, // or any default value
        emails: [],
        phoneNumbers: [],
        secondaryContactIds: []
    };
    
    // Initialize a Response object with the ResponseObj
    const initialResponse: Result = {
        contact: initialResponseObj
    };
    
    let result = allContacts.reduce((acc,element)=>{
        if(element.email){
            acc.contact.emails.push(element.email);
        }
        if(element.phoneNumber){
            acc.contact.phoneNumbers.push(element.phoneNumber);
        }
        if(element.linkedId){
            acc.contact.secondaryContactIds.push(element.linkedId);;
        }
        return acc;
    }, initialResponse);
    res.status(200).json(result);
    } catch(error) {
        console.log('Error - ',error);
    }
}

const getAll = async (req: Request, res: Response)=>{
    try {
        const allData = await prisma.contact.findMany();
        console.log(allData);
        res.status(200).json({Data: allData});
    } catch (error) {
        console.log('Error - ',error);
    }
}

const deleteDatabase = async (req: Request, res: Response)=>{
    try {
        const allData = await prisma.contact.deleteMany({});
        res.status(200).json({Success: "Successfully deleted"});
    } catch (error) {
        console.log('Error - ',error);
    }
}

export const controller = {
    add,
    getAll,
    deleteDatabase,
}