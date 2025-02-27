package hcmut.smart_garden_system.Services.Utils;

import java.security.SecureRandom;

public class OTPGenerator {
    private static final int OTP_LENGTH = 6;
    
    // Use SecureRandom instead of Random
    private static final SecureRandom secureRandom = new SecureRandom();
    
    public static String generateOTP() {
        StringBuilder otp = new StringBuilder();
        
        // generate random number
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(secureRandom.nextInt(10));
        }
        
        return otp.toString();
    }
    
    // Check valid OTP
    public static boolean isValidOTP(String otp) {
        if (otp == null || otp.length() != OTP_LENGTH) {
            return false;
        }
        
        // Check OTP just contain number
        return otp.matches("\\d+");
    }
}