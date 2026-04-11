const { pool } = require('../../config/db');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        console.log("Starting large-scale database seed...");

        // 1. Clear existing data
        await pool.query('DELETE FROM member_workouts');
        await pool.query('DELETE FROM payments');
        await pool.query('DELETE FROM subscriptions');
        await pool.query('DELETE FROM workouts');
        await pool.query('DELETE FROM plans');
        await pool.query('DELETE FROM trainers');
        await pool.query('DELETE FROM attendance');
        await pool.query('DELETE FROM users');
        console.log("Cleared old data.");

        const salt = await bcrypt.genSalt(10);
        const defaultHashedPass = await bcrypt.hash('password123', salt);

        // 2. Prepare Admins
        const admins = [
            { name: 'Nipendra', pass: 'admin1', email: 'nipendra@gym.com' },
            { name: 'Pavitra', pass: 'admin2', email: 'pavitra@gym.com' },
            { name: 'Rishav', pass: 'admin3', email: 'rishav@gym.com' },
            { name: 'Samikshya', pass: 'admin4', email: 'samikshya@gym.com' },
            { name: 'Sandipan', pass: 'admin5', email: 'sandipan@gym.com' }
        ];

        // 3. Insert All Users sequentially
        const userIds = { admin: [], trainer: [], member: [] };

        for (let a of admins) {
            const hpass = await bcrypt.hash(a.pass, salt);
            const res = await pool.query(
                `INSERT INTO users (name, email, password, role, phone, age) VALUES ($1, $2, $3, 'admin', '555-0000', 30) RETURNING id`,
                [a.name, a.email, hpass]
            );
            userIds.admin.push(res.rows[0].id);
        }

        for (let i = 1; i <= 10; i++) {
            const res = await pool.query(
                `INSERT INTO users (name, email, password, role, phone, age) VALUES ($1, $2, $3, 'trainer', $4, $5) RETURNING id`,
                [`Trainer ${i}`, `trainer${i}@gym.com`, defaultHashedPass, `555-10${i < 10 ? '0' + i : i}`, 25 + (i % 15)]
            );
            userIds.trainer.push(res.rows[0].id);
        }

        for (let i = 1; i <= 30; i++) {
            const res = await pool.query(
                `INSERT INTO users (name, email, password, role, phone, age) VALUES ($1, $2, $3, 'member', $4, $5) RETURNING id`,
                [`Member ${i}`, `member${i}@gym.com`, defaultHashedPass, `555-20${i < 10 ? '0' + i : i}`, 20 + (i % 20)]
            );
            userIds.member.push(res.rows[0].id);
        }
        console.log(`Seeded 5 Admins, 10 Trainers, and 30 Members.`);

        // 4. Insert Trainer Info
        const trainerPks = [];
        for (let uid of userIds.trainer) {
            const tInfo = await pool.query(`
                INSERT INTO trainers (user_id, specialization, available_from, available_to)
                VALUES ($1, 'General Fitness & Lifting', '06:00:00', '18:00:00') RETURNING id
            `, [uid]);
            trainerPks.push(tInfo.rows[0].id);
        }
        console.log("Assigned Trainer Schedules.");

        // 5. Insert Packages
        const plansQuery = `
            INSERT INTO plans (name, duration_months, price, description) VALUES
            ('Basic Monthly', 1, 1500.00, 'Access to basic gym equipment'),
            ('Pro Monthly', 1, 2500.00, 'Access to all equipment and group classes'),
            ('Annual VIP', 12, 25000.00, 'Unlimited access + 1 free training session')
            RETURNING id;
        `;
        const plansRes = await pool.query(plansQuery);
        const planIds = plansRes.rows.map(r => r.id);
        console.log("Seeded 3 Membership Plans.");

        // 6. Insert Workouts
        const workoutsQuery = `
            INSERT INTO workouts (name, description) VALUES
            ('Upper Body Power', 'Bench press, rows, overhead press'),
            ('Leg Day', 'Squats, lunges, leg press, calf raises'),
            ('HIIT Cardio', '30 minutes of high intensity interval training'),
            ('Core crusher', 'Abdominal focused conditioning routines.')
            RETURNING id;
        `;
        const workoutsRes = await pool.query(workoutsQuery);
        const workoutIds = workoutsRes.rows.map(r => r.id);
        console.log("Seeded 4 Workout Catalogs.");

        // 7. Subscribe Members to Plans (randomly assigning)
        for (let i = 0; i < userIds.member.length; i++) {
            const memberId = userIds.member[i];
            const planId = planIds[i % planIds.length];
            await pool.query(`
                INSERT INTO subscriptions (member_id, plan_id, start_date, end_date, status) VALUES
                ($1, $2, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 months', 'active')
            `, [memberId, planId]);
        }
        console.log("Distributed Member Subscriptions.");

        // 8. Assign routines (randomly connecting member, trainer, and workout)
        for (let i = 0; i < userIds.member.length; i++) {
            const memberId = userIds.member[i];
            const trainerPk = trainerPks[i % trainerPks.length];
            const workoutId = workoutIds[i % workoutIds.length];

            await pool.query(`
                INSERT INTO member_workouts (member_id, trainer_id, workout_id, is_active) VALUES
                ($1, $2, $3, TRUE)
            `, [memberId, trainerPk, workoutId]);
        }
        console.log("Assigned everyone a randomly distributed workout strategy.");

        console.log("✅ Massive database seeding completed successfully!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Error during seeding:", err);
        process.exit(1);
    }
}

seed();
