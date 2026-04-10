import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { createPrismaErrorResponse } from '@/lib/prisma-error';

export async function POST(req: NextRequest) {
    try {
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json(
                { error: 'Seed endpoint is disabled in production' },
                { status: 403 }
            );
        }

        // Create demo user
        const hashedPassword = await hashPassword('demo123');
        const user = await prisma.user.create({
            data: {
                phone: '9876543210',
                name: 'Demo Farmer',
                password: hashedPassword,
                language: 'en',
            },
        });

        // Create demo farm
        const farm = await prisma.farm.create({
            data: {
                userId: user.id,
                name: 'Green Valley Farm',
                location: 'Pune, Maharashtra',
                latitude: 18.5204,
                longitude: 73.8567,
                totalArea: 5.5,
                soilType: 'loam',
            },
        });

        // Create demo fields
        const field1 = await prisma.field.create({
            data: {
                farmId: farm.id,
                name: 'Field A',
                area: 2.5,
                cropType: 'rice',
                plantingDate: new Date('2024-01-15'),
                harvestDate: new Date('2024-06-15'),
                status: 'active',
            },
        });

        const field2 = await prisma.field.create({
            data: {
                farmId: farm.id,
                name: 'Field B',
                area: 3.0,
                cropType: 'wheat',
                plantingDate: new Date('2024-02-01'),
                harvestDate: new Date('2024-07-01'),
                status: 'active',
            },
        });

        // Create demo crops
        await prisma.crop.create({
            data: {
                fieldId: field1.id,
                name: 'rice',
                variety: 'Basmati',
                plantingDate: new Date('2024-01-15'),
                expectedHarvest: new Date('2024-06-15'),
                status: 'growing',
                waterRequirement: 200,
                growthStage: 'vegetative',
                health: 'good',
            },
        });

        await prisma.crop.create({
            data: {
                fieldId: field2.id,
                name: 'wheat',
                variety: 'HD-2967',
                plantingDate: new Date('2024-02-01'),
                expectedHarvest: new Date('2024-07-01'),
                status: 'growing',
                waterRequirement: 120,
                growthStage: 'flowering',
                health: 'good',
            },
        });

        // Create demo soil data
        await prisma.soilData.create({
            data: {
                fieldId: field1.id,
                moisture: 35.5,
                temperature: 28.3,
                ph: 6.8,
                nitrogen: 45.2,
                phosphorus: 32.1,
                potassium: 38.5,
            },
        });

        await prisma.soilData.create({
            data: {
                fieldId: field2.id,
                moisture: 42.1,
                temperature: 27.8,
                ph: 7.2,
                nitrogen: 48.5,
                phosphorus: 35.8,
                potassium: 41.2,
            },
        });

        // Create demo alerts
        await prisma.alert.create({
            data: {
                userId: user.id,
                type: 'irrigation',
                severity: 'high',
                title: 'Low Soil Moisture Detected',
                message: 'Field A moisture level below 20%. Immediate irrigation recommended.',
                isRead: false,
            },
        });

        await prisma.alert.create({
            data: {
                userId: user.id,
                type: 'weather',
                severity: 'medium',
                title: 'Heavy Rain Expected',
                message: '85% chance of rain in next 6 hours. Consider postponing irrigation.',
                isRead: false,
            },
        });

        return NextResponse.json({
            message: 'Demo data seeded successfully',
            created: {
                users: 1,
                farms: 1,
                fields: 2,
                crops: 2,
                soilData: 2,
                alerts: 2,
            },
        });
    } catch (error) {
        console.error('Seed error:', error);
        return createPrismaErrorResponse(error, 'Failed to seed data');
    }
}
